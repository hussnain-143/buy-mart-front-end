import { apiRequest } from "../utils/api.util";

/**
 * Get all active deals
 */
export const GetActiveDeals = async () => {
    try {
        const response = await apiRequest("/deal/active", {
            method: "GET",
        });
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get single deal by slug
 */
export const GetDealBySlug = async (slug: string) => {
    try {
        const response = await apiRequest(`/deal/${slug}`, {
            method: "GET",
        });
        return response;
    } catch (error) {
        throw error;
    }
};
