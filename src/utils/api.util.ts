// Use relative path in development (Vite proxy handles it) or env variable in production
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh access token using refresh token from cookies
 */
const refreshAccessToken = async (): Promise<string> => {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      let refreshUrl = `${API_BASE_URL}/user/refresh-token`;
      
      // If API_BASE_URL doesn't include /v1, add it
      if (!API_BASE_URL.includes('/v1')) {
        refreshUrl = `${API_BASE_URL}/v1/user/refresh-token`;
      }
      
      console.log("Attempting to refresh token from:", refreshUrl);
      
      const response = await fetch(refreshUrl, {
        method: "POST",
        credentials: "include", // Include cookies (refresh token)
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Token refresh failed:", data);
        throw new Error(data.message || "Failed to refresh token");
      }

      // Extract new access token from response
      // Backend returns either data.accessToken or data.data.accessToken
      const newAccessToken = data.data?.accessToken || data.accessToken;
      
      if (!newAccessToken) {
        console.error("Token refresh response missing accessToken:", data);
        throw new Error("No access token in refresh response");
      }

      // Update localStorage with new access token
      localStorage.setItem("token", newAccessToken);
      console.log("✓ Token refreshed successfully");

      return newAccessToken;
    } catch (error) {
      console.error("✗ Error refreshing token:", error);
      // Clear stored auth data on refresh failure
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const apiRequest = async (
  endpoint: string,
  { method = "GET", body = null, headers = {} }: { method?: string; body?: any; headers?: Record<string, string> } = {},
  retryCount = 0
): Promise<any> => {
  const isFormData = body instanceof FormData;
  
  // Get token from localStorage
  const token = localStorage.getItem("token");
  
  // Prepare headers
  const requestHeaders: Record<string, string> = { ...headers };
  
  // Add Authorization header if token exists
  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
    console.log("📤 Sending Authorization header with token:", token.substring(0, 20) + "...");
  } else {
    console.log("⚠️  No token in localStorage for Authorization header");
  }
  
  // Add Content-Type for non-FormData requests
  if (!isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  try {
    console.log(`🔗 Making ${method} request to ${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      credentials: "include", // Include cookies for refresh token
      headers: requestHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    // If response is OK, return the data
    if (response.ok) {
      console.log("✓ Request successful:", response.status);
      return data;
    }

    // Handle 401 Unauthorized - token may have expired
    if (response.status === 401 && token && retryCount === 0) {
      console.warn("✗ Received 401, attempting token refresh...");
      
      try {
        // Try to refresh the access token
        const newToken = await refreshAccessToken();
        
        // Retry the original request with the new token
        console.log("↻ Retrying request with new token:", newToken.substring(0, 20) + "...");
        return apiRequest(endpoint, { method, body, headers }, retryCount + 1);
      } catch (refreshError) {
        // Token refresh failed - user needs to login again
        console.error("✗ Token refresh failed, clearing auth data");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        const error = new Error("Session expired. Please login again.");
        (error as any).isTokenExpired = true;
        throw error;
      }
    }

    // For other errors or after retry attempt failed, throw the error
    if (response.status === 401 && retryCount > 0) {
      console.error("❌ Still 401 after token refresh retry - session invalid");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const error = new Error("Session expired. Please login again.");
      (error as any).isTokenExpired = true;
      throw error;
    }

    // Other error responses
    throw new Error(data.message || `Request failed with status ${response.status}`);
  } catch (error) {
    // Network or other errors
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
};

