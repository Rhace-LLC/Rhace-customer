// src/services/paymentsService.ts
import { getConfig } from "./utils/reqConfig";
import { bookiesAxiosInstance } from "./utils/baseUrl";

// ---------------- Types ----------------

export interface InitializePaymentPayload {
  order_id: string;
  callback_url: string;
}

export interface PaymentInitializationResponse {
  status: string;
  message: string;
  data: {
    payment_id: string;
    reference: string;
    authorization_url: string;
    access_code: string;
    amount: number;
    order_id: number;
  };
}

export interface PaymentVerificationResponse {
  status: string; // e.g. "error"
  message: string; // e.g. "An error occurred during verification
}

// ---------------- Payments ----------------

// GET /payments/history/
const getPaymentHistory = async (token?: string) => {
  const config = getConfig(`/payments/history/`, "GET", token);
  return bookiesAxiosInstance(config);
};

// POST /payments/initialize/
const initializePayment = async (
  data: InitializePaymentPayload,
  token?: string
): Promise<PaymentInitializationResponse> => {
  const config = getConfig(`/payments/initialize/`, "POST", token, data);
  return bookiesAxiosInstance(config);
};

// GET /payments/stats/
const getPaymentStats = async (token?: string) => {
  const config = getConfig(`/payments/stats/`, "GET", token);
  return bookiesAxiosInstance(config);
};

// GET /payments/verify/{reference}/
const verifyPayment = async (
  reference: string,
  token?: string
): Promise<PaymentVerificationResponse> => {
  const config = getConfig(`/payments/verify/${reference}/`, "GET", token);
  return bookiesAxiosInstance(config);
};

// POST /payments/webhook/
const paymentWebhook = async (data: any, token?: string) => {
  const config = getConfig(`/payments/webhook/`, "POST", token, data);
  return bookiesAxiosInstance(config);
};

// ---------------- Export ----------------
export {
  getPaymentHistory,
  initializePayment,
  getPaymentStats,
  verifyPayment,
  paymentWebhook,
};
