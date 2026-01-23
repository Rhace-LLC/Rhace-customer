import { BillSubmission } from "@/pages/orders/components/AllocationModal";
import { bookiesAxiosInstance } from "./utils/baseUrl";
import { getConfig } from "./utils/reqConfig";

export interface BillItem {
  id: number;
  menu_item_name: string;
  menu_item_id: string;
  quantity: number;
  price: string; // could also be number if you convert
}

export interface BillOrder {
  id: number;
  customer: string;
  customer_name_display: string;
  restaurant_name: string;
  paid_by: string | null;
  paid_by_name: string | null;
  group: string;
  order_type: string;
  table: string;
  table_number: string;
  items: BillItem[];
  total_price: string;
  status: string;
  waiter: string | null;
  waiter_name: string | null;
  customer_name: string;
  address: string;
  customer_phone: string;
  driver: string | null;
  driver_name: string | null;
  delay_reason: string | null;
  created_at: string;
  payment: string;
  payment_reference: string | null;
  estimated_wait_minutes: number;
  ready_at: string | null;
  paid_at: string | null;
  is_paid: boolean;
}
export interface SplitRecord {
  id: number;
  customer: string; // user UUID
  customer_name: string;
  amount_to_pay: string; // API returns money as string
  amount_paid: string; // API returns money as string
  is_paid: boolean;
  paid_at: string | null; // ISO date string or null
}
export interface IndividualPayment {
  id: number;
  customer: string; // UUID
  customer_name: string;
  total_to_pay: string; // money as string from API
  amount_paid: string; // money as string from API
  is_paid: boolean;
  paid_at: string | null; // ISO timestamp or null
  paying_for_orders: number[]; // order IDs
}

export interface Bill {
  id: number;
  dining_group: string;
  created_by: string;
  created_by_name: string;
  restaurant: string;
  total_amount: string;
  payment_method: string;
  status: string;
  total_paid_amount: string;
  orders: BillOrder[];
  split_records: SplitRecord[]; // if you have types for split records, replace `any`
  individual_payments: IndividualPayment[]; // same here
  created_at: string;
  updated_at: string;
  paid_at: string | null;
}

export interface BillSummaryResponse {
  status: "success" | "error"; // or just string if there are other statuses
  payment_method: string;
  bill: Bill;
}

/**
 * GET /orders/my-current-bill/
 */
const getMyCurrentBill = (token: string): Promise<any> => {
  const config = getConfig("/orders/my-current-bill/", "GET", token);

  return bookiesAxiosInstance(config);
};

/**
 * POST /orders/add-all-to-my-bill/
 * Adds all my unpaid orders to my bill
 */
const addAllOrdersToMyBill = (token: string): Promise<any> => {
  const config = getConfig("/orders/add-all-to-my-bill/", "POST", token);

  return bookiesAxiosInstance(config);
};

/**
 * POST /orders/{order_id}/add-to-my-bill/
 * Adds a single order to my bill
 */
const addOrderToMyBill = (orderId: number, token: string): Promise<any> => {
  const config = getConfig(`/orders/${orderId}/add-to-my-bill/`, "POST", token);

  return bookiesAxiosInstance(config);
};

/**
 * POST /orders/bill-groups/{bill_group_id}/pay/
 * Pays a bill group
 */
const payBillGroup = (billGroupId: number, token: string): Promise<any> => {
  const config = getConfig(
    `/orders/bill-groups/${billGroupId}/pay/`,
    "POST",
    token
  );

  return bookiesAxiosInstance(config);
};

/**
 * Initiate payment for a dining group bill
 */
const initiateDiningGroupPayment = (
  diningGroupId: string,
  token: string
): Promise<any> => {
  const config = getConfig(
    `/orders/dining-group-bill/${diningGroupId}/initiate-payment/`,
    "POST",
    token
  );

  return bookiesAxiosInstance(config);
};

/**
 * Select orders for a dining group bill
 */
const selectDiningGroupOrders = (
  diningGroupId: string,
  orderIds: number[],
  token: string
): Promise<any> => {
  const config = getConfig(
    `/orders/dining-group-bill/${diningGroupId}/select-orders/`,
    "POST",
    token,
    { order_ids: orderIds }
  );

  return bookiesAxiosInstance(config);
};

/**
 * Submit split amounts for a dining group bill
 */
const submitSplitAmounts = (
  diningGroupId: string,
  data: BillSubmission,
  token: string
): Promise<any> => {
  const config = getConfig(
    `/orders/dining-group-bill/${diningGroupId}/submit-split-amounts/`,
    "POST",
    token,
    data
  );

  return bookiesAxiosInstance(config);
};

/**
 * Get dining group bill summary
 */
const getDiningGroupBillSummary = (
  diningGroupId: string,
  token: string
): Promise<BillSummaryResponse> => {
  const config = getConfig(
    `/orders/dining-group/${diningGroupId}/bill-summary/`,
    "GET",
    token
  );

  return bookiesAxiosInstance(config);
};

/**
 * Verify dining group bill payment
 */
const verifyDiningGroupPayment = (
  diningGroupId: string,
  reference: string,
  token: string
): Promise<any> => {
  const config = getConfig(
    `/orders/dining-group-bill/${diningGroupId}/verify-payment/${reference}/`,
    "GET",
    token
  );

  return bookiesAxiosInstance(config);
};

/**
 * Get dining group bill with splits
 */
const getDiningGroupBillWithSplits = (
  diningGroupId: string,
  token: string
): Promise<any> => {
  const config = getConfig(
    `/orders/dining-group-bill/${diningGroupId}/with-splits/`,
    "GET",
    token
  );

  return bookiesAxiosInstance(config);
};

/**
 * Request a bill for a dining group
 */
const requestDiningGroupBill = (
  diningGroupId: string,
  paymentMethod: "individual" | "split",
  token: string
): Promise<any> => {
  const config = getConfig(
    `/orders/dining-group/${diningGroupId}/request-bill/`,
    "POST",
    token,
    { payment_method: paymentMethod }
  );

  return bookiesAxiosInstance(config);
};

export {
  payBillGroup,
  addAllOrdersToMyBill,
  addOrderToMyBill,
  getMyCurrentBill,
  requestDiningGroupBill,
  getDiningGroupBillSummary,
  getDiningGroupBillWithSplits,
  verifyDiningGroupPayment,
  initiateDiningGroupPayment,
  submitSplitAmounts,
  selectDiningGroupOrders,
};
