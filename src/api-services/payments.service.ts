import { getConfig } from "./utils/reqConfig";
import { bookiesAxiosInstance } from "./utils/baseUrl";

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
  status: "success" | "error";
  data: {
    payment_status: "pending" | "success" | "failed";
    amount: number;
    fees: number;
    payment_method: string;
    order_status: string;
    paid_at: string | null;
  };
}

export interface Payment {
  id: string;
  reference: string;
  order_id: number;
  amount: number;
  currency: string;
  status: "processing" | "failed" | "success";
  payment_method: string | null;
  customer_email: string;
  created_at: string;
  paid_at: string | null;
  fees: number;
  order_type: "dine-in" | string;
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaymentHistoryResponse {
  payments: Payment[];
  pagination: Pagination;
}

// GET /payments/history/
const getPaymentHistory = async (
  token?: string,
  params?: any
): Promise<PaymentHistoryResponse> => {
  const config = getConfig(
    `/payments/history/`,
    "GET",
    token,
    undefined,
    params
  );
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
