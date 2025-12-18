import { apiRequest } from "../utils/api.util";

export const LoginUser = (data) => {
  return apiRequest("/user/login", {
    method: "POST",
    body: data,
  });
};


export const SigninUser = (formData) => {
    return apiRequest("/user/signup", {
        method: "POST",
        body: formData,          // ✅ FormData
        credentials: "include",
    });
}