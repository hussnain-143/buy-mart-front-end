import { apiRequest } from "../utils/api.util";

export const CreateVendor = <T>(data: T) => {
  const isFormData = data instanceof FormData;
  
  return apiRequest("/vendor/create", {
    method: "POST",
    body: data,
    credentials: "include",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  } as any);
};