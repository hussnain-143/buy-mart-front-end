import { apiRequest } from "../utils/api.util";

export const AddBrand = <T>(data: T) => {
    return apiRequest("/brand", {
        method: "POST",
        body: data,
        credentials: "include",
    } as any);
};

export const GetAllBrands = () => {
    return apiRequest("/brand", {
        method: "GET",
    });
};

export const GetUserBrands = () => {
    return apiRequest("/brand/user-brands", {
        method: "GET",
        credentials: "include",
    } as any);
};

export const GetAdminBrands = () => {
    return apiRequest("/brand/admin", {
        method: "GET",
        credentials: "include",
    } as any);
};

export const ApproveBrand = (id: string) => {
    return apiRequest(`/brand/approve/${id}`, {
        method: "PATCH",
        credentials: "include",
    } as any);
};

export const UpdateBrandStatus = (id: string) => {
    return apiRequest(`/brand/status/${id}`, {
        method: "PATCH",
        credentials: "include",
    } as any);
};

export const DeleteBrand = (id: string) => {
    return apiRequest(`/brand/${id}`, {
        method: "DELETE",
        credentials: "include",
    } as any);
};
