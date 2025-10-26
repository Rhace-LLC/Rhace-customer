// src/services/ordersService.ts
import { getConfig } from "./utils/reqConfig";
import { bookiesAxiosInstance } from "./utils/baseUrl";

// ---------------- Types ----------------

export interface OrderItem {
  menu_item_id: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customer_id: string;
  order_type: string;
  table_id?: string;
  items: OrderItem[];
  status: string;
  waiter_id?: string;
  customer_name?: string;
  address?: string;
  customer_phone?: string;
  driver?: string;
}

export interface UpdateOrderPayload {
  customer?: string;
  order_type?: string;
  table?: string;
  items?: number[];
  total_price?: string;
  status?: string;
  waiter?: string;
  customer_name?: string;
  address?: string;
  customer_phone?: string;
  driver?: string;
  delay_reason?: string;
}

export interface BulkStatusPayload {
  order_ids: number[];
  status: string;
}
export interface OrderResponse {
  id: number;
  order_type: string;
  status: string;
  customer_name: string;
  address: string;
  customer_phone: string;
  driver: string | null;
}
// ---------------- Orders ----------------
export interface OrderResponse {
  id: number;
  customer: string;
  order_type: string;
  table: string;
  items: number[]; // array of item IDs
  total_price: string; // or number if you want to parse it
  status: string;
  waiter: string;
  customer_name: string;
  address: string;
  customer_phone: string;
  driver: string | null;
  delay_reason: string | null;
  created_at: string; // ISO date string
}

// GET /orders/
const getOrders = async (token?: string): Promise<OrderResponse[]> => {
  const config = getConfig(`/orders/`, "GET", token);
  return bookiesAxiosInstance(config);
};

// POST /orders/{order_id}/assign-table/
const assignTable = async (
  order_id: number,
  data: UpdateOrderPayload,
  token?: string
) => {
  const config = getConfig(
    `/orders/${order_id}/assign-table/`,
    "POST",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

// POST /orders/{order_id}/cancel/
const cancelOrder = async (
  order_id: number,
  data: UpdateOrderPayload,
  token?: string
) => {
  const config = getConfig(`/orders/${order_id}/cancel/`, "POST", token, data);
  return bookiesAxiosInstance(config);
};

// GET /orders/{order_id}/queue/
const getOrderQueue = async (order_id: number, token?: string) => {
  const config = getConfig(`/orders/${order_id}/queue/`, "GET", token);
  return bookiesAxiosInstance(config);
};

// POST /orders/{order_id}/update-status/
const updateOrderStatus = async (
  order_id: number,
  data: UpdateOrderPayload,
  token?: string
) => {
  const config = getConfig(
    `/orders/${order_id}/update-status/`,
    "POST",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

// POST /orders/bulk-status-update/
const bulkUpdateStatus = async (data: BulkStatusPayload, token?: string) => {
  const config = getConfig(`/orders/bulk-status-update/`, "POST", token, data);
  return bookiesAxiosInstance(config);
};

// POST /orders/create/
const createOrder = async (
  data: CreateOrderPayload,
  token?: string
): Promise<OrderResponse> => {
  const config = getConfig(`/orders/create/`, "POST", token, data);
  return bookiesAxiosInstance(config);
};

// GET /orders/order/{order_id}/confirm-delivery/token={confirmation_token}
const confirmDeliveryGet = async (
  order_id: number,
  confirmation_token: string,
  token?: string
) => {
  const config = getConfig(
    `/orders/order/${order_id}/confirm-delivery/token=${confirmation_token}`,
    "GET",
    token
  );
  return bookiesAxiosInstance(config);
};

// POST /orders/order/{order_id}/confirm-delivery/token={confirmation_token}
const confirmDeliveryPost = async (
  order_id: number,
  confirmation_token: string,
  data: UpdateOrderPayload,
  token?: string
) => {
  const config = getConfig(
    `/orders/order/${order_id}/confirm-delivery/token=${confirmation_token}`,
    "POST",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

// Export all functions
export {
  getOrders,
  assignTable,
  cancelOrder,
  getOrderQueue,
  updateOrderStatus,
  bulkUpdateStatus,
  createOrder,
  confirmDeliveryGet,
  confirmDeliveryPost,
};
