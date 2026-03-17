import { apiRequest } from "../utils/api.util";

export const GetAllCategories = () => {
    return apiRequest("/category", {
        method: "GET",
    });
};

export const GetAdminCategories = () => {
    return apiRequest("/category/admin", {
        method: "GET",
        credentials: "include",
    } as any);
};

export const AddCategory = <T>(data: T) => {
    return apiRequest("/category", {
        method: "POST",
        body: data,
        credentials: "include",
    } as any);
};

export const UpdateCategory = <T>(id: string, data: T) => {
    return apiRequest(`/category/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
    } as any);
};

export const DeleteCategory = (id: string) => {
    return apiRequest(`/category/${id}`, {
        method: "DELETE",
        credentials: "include",
    } as any);
};
