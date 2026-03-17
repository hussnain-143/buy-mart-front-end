import { apiRequest } from "../utils/api.util";

export const GetLogEntries = async () => {
    return apiRequest("/logs", { method: "GET" });
};

export const GetUserActivityLogs = async (userId?: string) => {
    const url = userId ? `/logs/user/${userId}` : "/logs/user";
    return apiRequest(url, { method: "GET" });
};
