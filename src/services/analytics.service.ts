import { apiRequest } from "../utils/api.util";

export const GetAdminStats = async () => {
    return apiRequest("/analytics/admin", { method: "GET" });
};

export const GetVendorStats = async () => {
    return apiRequest("/analytics/vendor", { method: "GET" });
};

export const GetSidebarMetrics = async () => {
    return apiRequest("/analytics/sidebar-metrics", { method: "GET" });
};
