import { apiRequest } from "../utils/api.util";


export const LoginUser = <T>(data: T) => {
  return apiRequest("/user/login", {
    method: "POST",
    body: data,
  });
};


export const SigninUser = <T>(data: T, isFormData = false) => {
  return apiRequest("/user/signup", {
    method: "POST",
    body: data, 
    credentials: "include",
    // DON'T set "Content-Type" header for FormData — browser handles it automatically
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  } as any);
};

export const LogoutUser = () => {
  return apiRequest("/user/logout", {
    method: "POST",
    credentials: "include",
  } as any);
};

export const GetUserProfile = () => {
  return apiRequest("/user/me", {
    method: "GET",
    credentials: "include",
  } as any);
};

/**
 * Update basic profile information
 * - firstName, lastName, userName, email, profile (image)
 */
export const UpdateProfile = <T>(data: T, isFormData = false) => {
  return apiRequest("/user/update-profile", {
    method: "PUT",
    body: data,
    credentials: "include",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  } as any);
};

/**
 * Update user password
 * - Requires old password
 * - Sets new password securely
 */
export const UpdatePassword = <T>(data: T) => {
  return apiRequest("/user/update-password", {
    method: "PUT",
    body: data,
    credentials: "include",
  } as any);
};

/**
 * Update user address
 * - Updates shipping / billing address
 */
export const UpdateAddress = <T>(data: T) => {
  return apiRequest("/user/update-address", {
    method: "PUT",
    body: data,
    credentials: "include",
  } as any);
};

/**
 * Refresh access token
 * - Uses refresh token from cookies to get new access token
 */
export const RefreshAccessToken = () => {
  return apiRequest("/user/refresh-token", {
    method: "POST",
    credentials: "include",
  } as any);
};
