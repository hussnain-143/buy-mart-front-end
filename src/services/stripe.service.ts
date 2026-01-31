import { apiRequest } from "../utils/api.util";

export const createCheckoutSession = (data: any) => {
  return apiRequest("/stripe/checkout", {
    method: "POST",
    body: data,
  });
};

export const verifySession = (sessionId: string) => {
  return apiRequest(`/stripe/verify?sessionId=${sessionId}`, {
    method: "GET",
  });
};