import { apiRequest } from "../utils/api.util";

export const GetAllProducts = (params = {}) => {
    const searchParams = new URLSearchParams(params as any).toString();
    return apiRequest(`/product?${searchParams}`, {
        method: "GET",
    });
};

export const GetProductById = (id: string) => {
    return apiRequest(`/product/${id}`, {
        method: "GET",
    });
};

export const AddProduct = <T>(data: T, isFormData = true) => {
    return apiRequest("/product", {
        method: "POST",
        body: data,
        credentials: "include",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
    } as any);
};

export const UpdateProduct = <T>(id: string, data: T) => {
    return apiRequest(`/product/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
    } as any);
};

export const AISearch = (query: string) => {
    return apiRequest(`/product/ai-search?q=${query}`, {
        method: "GET",
    });
};

export const DeleteProduct = (id: string) => {
    return apiRequest(`/product/${id}`, {
        method: "DELETE",
        credentials: "include",
    } as any);
};

export const GetVendorProducts = () => {
    return apiRequest("/product/vendor", {
        method: "GET",
        credentials: "include",
    } as any);
};

export const GetAdminProducts = (params = {}) => {
    const searchParams = new URLSearchParams(params as any).toString();
    return apiRequest(`/product/admin/all?${searchParams}`, {
        method: "GET",
        credentials: "include",
    } as any);
};

export const ToggleProductStatus = (id: string) => {
    return apiRequest(`/product/admin/${id}/toggle-status`, {
        method: "PATCH",
        credentials: "include",
    } as any);
};
