import { bookiesAxiosInstance } from "./utils/baseUrl";
import { getConfig } from "./utils/reqConfig";

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

export {
  payBillGroup,
  addAllOrdersToMyBill,
  addOrderToMyBill,
  getMyCurrentBill,
};
