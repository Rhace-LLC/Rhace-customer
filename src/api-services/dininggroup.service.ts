/* ================================
   Types
================================ */
import { BillOrder } from "./billsettlement.service";
import { bookiesAxiosInstance } from "./utils/baseUrl";
import { getConfig } from "./utils/reqConfig";

export interface DiningGroupCustomer {
  id: string;
  first_name: string;
  last_name: string;
}

export interface DiningGroup {
  id: string;
  access_code: string;
  active: boolean;
  created: string;
  updated: string;
  created_by: string;
  table: string;

  customers: DiningGroupCustomer[];
  orders: BillOrder[];
  orders_completed: boolean;
}

export interface JoinDiningGroupPayload {
  access_code: string;
  group_id: string;
}

export interface CreateDiningGroupPayload {
  table: string;
}

/* ================================
   Requests
================================ */

/**
 * List dining groups for a table
 * GET /menu/dining-groups/{table_id}/list/
 */
export const getDiningGroupsByTable = async (
  tableId: string,
  token?: string
): Promise<DiningGroup[]> => {
  const config = getConfig(
    `/menu/dining-groups/${tableId}/list/`,
    "GET",
    token
  );

  return bookiesAxiosInstance(config);
};

/**
 * Create a new dining group
 * POST /menu/dining-groups/create/
 */
export const createDiningGroup = async (
  payload: CreateDiningGroupPayload,
  token?: string
): Promise<DiningGroup> => {
  const config = getConfig(
    `/menu/dining-groups/create/`,
    "POST",
    token,
    payload
  );

  return bookiesAxiosInstance(config);
};

/**
 * Join an existing dining group
 * POST /menu/dining-groups/join/
 */
export const joinDiningGroup = async (
  payload: JoinDiningGroupPayload,
  token?: string
): Promise<{ message: string }> => {
  const config = getConfig(`/menu/dining-groups/join/`, "POST", token, payload);

  return bookiesAxiosInstance(config);
};

export const getCurrentGroup = async (token?: string): Promise<DiningGroup> => {
  const config = getConfig(`/menu/dining-groups/current/`, "GET", token);

  return bookiesAxiosInstance(config);
};

export const leaveGroup = async (token?: string): Promise<DiningGroup> => {
  const config = getConfig(`/menu/dining-groups/leave/`, "POST", token);

  return bookiesAxiosInstance(config);
};
