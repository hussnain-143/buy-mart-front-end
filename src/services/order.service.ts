import { apiRequest } from "../utils/api.util";

export const CreateOrder = <T>(data: T) => {
    return apiRequest("/order", {
        method: "POST",
        body: data,
        credentials: "include",
    } as any);
};

export const GetUserOrders = (params = {}) => {
    const searchParams = new URLSearchParams(params as any).toString();
    return apiRequest(`/order?${searchParams}`, {
        method: "GET",
        credentials: "include",
    } as any);
};

export const GetOrderById = (id: string) => {
    return apiRequest(`/order/${id}`, {
        method: "GET",
        credentials: "include",
    } as any);
};

export const GetVendorOrders = () => {
    return apiRequest("/order/vendor", {
        method: "GET",
        credentials: "include",
    } as any);
};

export const GetAllOrders = () => {
    return apiRequest("/order/all", {
        method: "GET",
        credentials: "include",
    } as any);
};

export const UpdateOrderStatus = (id: string, body: any) => {
    return apiRequest(`/order/${id}/status`, {
        method: "PATCH",
        body,
        credentials: "include",
    } as any);
};
