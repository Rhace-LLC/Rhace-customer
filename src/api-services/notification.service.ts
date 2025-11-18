// src/services/notificationsService.ts

import { getConfig } from "./utils/reqConfig";
import { bookiesAxiosInstance } from "./utils/baseUrl";

// ---------------- Types ----------------

export interface Notification {
  id: number;
  user: string;
  user_name: string;
  restaurant: string;
  restaurant_name: string;
  notification_type: string; // e.g., "order_created"
  title: string;
  message: string;
  metadata: string;
  is_read: boolean;
  read_at: string | null;
  priority: string; // e.g., "low", "high"
  created_at: string;
  updated_at: string;
  is_expired: string;
  time_ago: string;
}

export interface NotificationPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

export interface MarkReadPayload {
  notification_ids: number[];
}

// ---------------- Notifications Service ----------------
export interface NotificationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}
// GET /notifications/?page=1&page_size=10
const getNotifications = async (
  page = 1,
  page_size = 10,
  token?: string
): Promise<NotificationResponse> => {
  const config = getConfig(
    `/notifications/?page=${page}&page_size=${page_size}`,
    "GET",
    token
  );
  return bookiesAxiosInstance(config);
};

// DELETE /notifications/{notification_id}/delete/
const deleteNotification = async (notification_id: number, token?: string) => {
  const config = getConfig(
    `/notifications/${notification_id}/delete/`,
    "DELETE",
    token
  );
  return bookiesAxiosInstance(config);
};

// DELETE /notifications/clear-all/
const clearAllNotifications = async (token?: string) => {
  const config = getConfig(`/notifications/clear-all/`, "DELETE", token);
  return bookiesAxiosInstance(config);
};

// POST /notifications/mark-read/
const markNotificationsRead = async (data: MarkReadPayload, token?: string) => {
  const config = getConfig(`/notifications/mark-read/`, "POST", token, data);
  return bookiesAxiosInstance(config);
};

// GET /notifications/unread-count/
const getUnreadCount = async (
  token?: string
): Promise<{ unread_count: number }> => {
  const config = getConfig(`/notifications/unread-count/`, "GET", token);
  return bookiesAxiosInstance(config);
};

// ---------------- Export All ----------------
export {
  getNotifications,
  deleteNotification,
  clearAllNotifications,
  markNotificationsRead,
  getUnreadCount,
};
