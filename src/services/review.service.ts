import { apiRequest } from "../utils/api.util";

export const AddReview = <T>(data: T) => {
    return apiRequest("/review", {
        method: "POST",
        body: data,
        credentials: "include",
    } as any);
};

export const GetProductReviews = (productId: string) => {
    return apiRequest(`/review/product/${productId}`, {
        method: "GET",
    });
};

export const DeleteReview = (id: string) => {
    return apiRequest(`/review/${id}`, {
        method: "DELETE",
        credentials: "include",
    } as any);
};

export const GetAllReviews = () => {
    return apiRequest("/review/all", {
        method: "GET",
        credentials: "include",
    } as any);
};

export const GetVendorReviews = () => {
    return apiRequest("/review/vendor", {
        method: "GET",
        credentials: "include",
    } as any);
};
