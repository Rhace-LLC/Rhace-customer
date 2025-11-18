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
  customer: string;
  order_type: string;
  table: string;
  items: number[];
  total_price: string;
  status: string;
  waiter: string;
  customer_name: string;
  address: string;
  customer_phone: string;
  driver: string | null;
  delay_reason: string | null;
  created_at: string;
}

// ---------------- Orders ----------------

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
): Promise<any> => {
  const config = getConfig(`/orders/create/`, "POST", token, data);
  return bookiesAxiosInstance(config);
};

// ---------------- Delivery Confirmation ----------------

// GET /orders/order/{order_id}/confirm-delivery/token={token}
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

// POST /orders/order/{order_id}/confirm-delivery/token={token}
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

// ---------------- Newly Added Delivery Endpoints ----------------

// GET /orders/orders/{order_id}/confirm-delivery/
const confirmDeliveryGetNoToken = async (order_id: number, token?: string) => {
  const config = getConfig(
    `/orders/orders/${order_id}/confirm-delivery/`,
    "GET",
    token
  );
  return bookiesAxiosInstance(config);
};

// POST /orders/orders/{order_id}/confirm-delivery/
const confirmDeliveryPostNoToken = async (
  order_id: number,
  data: UpdateOrderPayload,
  token?: string
) => {
  const config = getConfig(
    `/orders/orders/${order_id}/confirm-delivery/`,
    "POST",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

// GET /orders/orders/{order_id}/wait-time/
const getOrderWaitTime = async (order_id: number, token?: string) => {
  const config = getConfig(
    `/orders/orders/${order_id}/wait-time/`,
    "GET",
    token
  );
  return bookiesAxiosInstance(config);
};

// POST /orders/orders/bulk-confirm-delivery/
const bulkConfirmDelivery = async (
  data: { order_ids: number[] },
  token?: string
) => {
  const config = getConfig(
    `/orders/orders/bulk-confirm-delivery/`,
    "POST",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

// ---------------- Assignment Endpoints ----------------

// POST /orders/assign-driver/
const assignDriver = async (data: UpdateOrderPayload, token?: string) => {
  const config = getConfig(`/orders/assign-driver/`, "POST", token, data);
  return bookiesAxiosInstance(config);
};

// POST /orders/assign-waiter/
const assignWaiter = async (data: UpdateOrderPayload, token?: string) => {
  const config = getConfig(`/orders/assign-waiter/`, "POST", token, data);
  return bookiesAxiosInstance(config);
};

// ---------------- Reservations ----------------

// GET /orders/reservations/
const getReservations = async (token?: string) => {
  const config = getConfig(`/orders/reservations/`, "GET", token);
  return bookiesAxiosInstance(config);
};

// GET /orders/reservations/{id}/
const getReservationById = async (id: number, token?: string) => {
  const config = getConfig(`/orders/reservations/${id}/`, "GET", token);
  return bookiesAxiosInstance(config);
};

// PUT /orders/reservations/{id}/
const updateReservationPut = async (id: number, data: any, token?: string) => {
  const config = getConfig(`/orders/reservations/${id}/`, "PUT", token, data);
  return bookiesAxiosInstance(config);
};

// PATCH /orders/reservations/{id}/
const updateReservationPatch = async (
  id: number,
  data: any,
  token?: string
) => {
  const config = getConfig(`/orders/reservations/${id}/`, "PATCH", token, data);
  return bookiesAxiosInstance(config);
};

// DELETE /orders/reservations/{id}/
const deleteReservation = async (id: number, token?: string) => {
  const config = getConfig(`/orders/reservations/${id}/`, "DELETE", token);
  return bookiesAxiosInstance(config);
};

// PUT /orders/reservations/{id}/cancel/
const cancelReservation = async (id: number, token?: string) => {
  const config = getConfig(`/orders/reservations/${id}/cancel/`, "PUT", token);
  return bookiesAxiosInstance(config);
};

// PUT /orders/reservations/{id}/status-update/
const updateReservationStatus = async (
  id: number,
  data: any,
  token?: string
) => {
  const config = getConfig(
    `/orders/reservations/${id}/status-update/`,
    "PUT",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

// PUT /orders/reservations/{id}/update
const reservationUpdatePut = async (id: number, data: any, token?: string) => {
  const config = getConfig(
    `/orders/reservations/${id}/update`,
    "PUT",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

// PATCH /orders/reservations/{id}/update
const reservationUpdatePatch = async (
  id: number,
  data: any,
  token?: string
) => {
  const config = getConfig(
    `/orders/reservations/${id}/update`,
    "PATCH",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

// POST /orders/reservations/create/
const createReservation = async (
  restaurant_id: string,
  data: any,
  token?: string
) => {
  const config = getConfig(
    `/orders/reservations/create/${restaurant_id}`,
    "POST",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

// GET /orders/table-reservation/{table_id}/
const getTableReservation = async (table_id: number, token?: string) => {
  const config = getConfig(
    `/orders/table-reservation/${table_id}/`,
    "GET",
    token
  );
  return bookiesAxiosInstance(config);
};

// ---------------- Export ----------------
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
  confirmDeliveryGetNoToken,
  confirmDeliveryPostNoToken,
  getOrderWaitTime,
  bulkConfirmDelivery,
  assignDriver,
  assignWaiter,
  getReservations,
  getReservationById,
  updateReservationPut,
  updateReservationPatch,
  deleteReservation,
  cancelReservation,
  updateReservationStatus,
  reservationUpdatePut,
  reservationUpdatePatch,
  createReservation,
  getTableReservation,
};
