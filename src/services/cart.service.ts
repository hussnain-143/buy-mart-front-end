import { apiRequest } from "../utils/api.util";

export const GetCart = () => {
    return apiRequest("/cart", {
        method: "GET",
        credentials: "include",
    } as any);
};

export const AddToCart = <T>(data: T) => {
    return apiRequest("/cart", {
        method: "POST",
        body: data,
        credentials: "include",
    } as any);
};

export const UpdateCartItem = <T>(id: string, data: T) => {
    return apiRequest(`/cart/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
    } as any);
};

export const RemoveFromCart = (id: string) => {
    return apiRequest(`/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
    } as any);
};

export const ClearCart = () => {
    return apiRequest("/cart/clear", {
        method: "DELETE",
        credentials: "include",
    } as any);
};
