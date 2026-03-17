import { apiRequest } from "../utils/api.util";

/**
 * Get the current user's vendor profile
 */
export const GetMyVendor = () => {
  return apiRequest("/vendor/me", {
    method: "GET",
    credentials: "include",
  } as any);
};

/**
 * Update the current user's vendor profile
 * @param data FormData containing shop_name, description, etc. and images
 */
export const UpdateVendorProfile = (data: FormData) => {
  return apiRequest("/vendor/update", {
    method: "PATCH",
    body: data,
    credentials: "include",
  } as any);
};

/**
 * Create a new vendor profile (Setup)
 */
export const CreateVendor = (data: FormData) => {
  return apiRequest("/vendor/create", {
    method: "POST",
    body: data,
    credentials: "include",
  } as any);
};

/**
 * Get vendor stripe id
 */
export const getVendorKey = () => {
  return apiRequest("/vendor/stripe-id", {
    method: "GET",
    credentials: "include",
  } as any);
};

/**
 * Set vendor stripe id
 */
export const setVendorKey = (data: { stripe_vendor_id: string }) => {
  return apiRequest("/vendor/stripe-id", {
    method: "PUT",
    body: data,
    credentials: "include",
  } as any);
};

/* ===================== ADMIN FUNCTIONS ===================== */

/**
 * Get All Vendors (Admin)
 */
export const GetAllVendors = () => {
  return apiRequest("/vendor/all", {
    method: "GET",
    credentials: "include",
  } as any);
};

/**
 * Approve a vendor (Admin)
 */
export const ApproveVendor = (vendor_id: string) => {
  return apiRequest("/vendor/approve", {
    method: "POST",
    body: { vendor_id },
    credentials: "include",
  } as any);
};

/**
 * Alias for ApproveVendor to match legacy frontend imports if any
 */
export const updateVendor = (vendor_id: string) => ApproveVendor(vendor_id);

/**
 * Toggle Vendor Status (Admin)
 */
export const ToggleVendorStatus = (id: string) => {
  return apiRequest(`/vendor/admin/${id}/toggle-status`, {
    method: "PATCH",
    credentials: "include",
  } as any);
};