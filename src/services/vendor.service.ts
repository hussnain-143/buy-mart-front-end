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

export const GetAllVendors = () => {
  return apiRequest("/vendor/all", {
    method: "GET",
    credentials: "include",
  } as any);
};

export const updateVendor = (id: string) => {
  return apiRequest(`/vendor/approve`, {
    method: "POST",
    body: { vendor_id: id },
    credentials: "include",
  } as any);
};