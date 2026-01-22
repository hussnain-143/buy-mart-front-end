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

