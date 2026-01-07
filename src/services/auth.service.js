import { apiRequest } from "../utils/api.util";

export const LoginUser = (data) => {
  return apiRequest("/user/login", {
    method: "POST",
    body: data,
  });
};


export const SigninUser = (data, isFormData = false) => {
  return apiRequest("/user/signup", {
    method: "POST",
    body: data, 
    credentials: "include",
    // DON'T set "Content-Type" header for FormData — browser handles it automatically
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  });
};
