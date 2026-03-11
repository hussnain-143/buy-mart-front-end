import { apiRequest } from "../utils/api.util";

export const createCheckoutSession = (data: any) => {
  return apiRequest("/stripe/checkout", {
    method: "POST",
    body: data,
    credentials: "include",
  } as any);
};

export const CreateProductCheckout = (data: any) => {
  return apiRequest("/stripe/product-checkout", {
    method: "POST",
    body: data,
    credentials: "include",
  } as any);
};

export const verifySession = (sessionId: string) => {
  return apiRequest(`/stripe/verify?sessionId=${sessionId}`, {
    method: "GET",
    credentials: "include",
  } as any);
};