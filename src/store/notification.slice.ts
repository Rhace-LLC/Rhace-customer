// src/store/notification.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ---------------- Types ----------------
export interface Notification {
  id: number;
  user: string;
  user_name: string;
  restaurant: string;
  restaurant_name: string;
  notification_type: string;
  title: string;
  message: string;
  metadata: string;
  is_read: boolean;
  read_at: string | null;
  priority: string;
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

interface NotificationState {
  data: Record<string, Notification[]>; // page -> notifications
  total: number;
  loading: boolean;
  error: string;
}

// ---------------- Initial State ----------------
const initialState: NotificationState = {
  data: {},
  total: 0,
  loading: false,
  error: "",
};

// ---------------- Slice ----------------
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationsPage: (
      state,
      action: PayloadAction<{ page: number; notifications: Notification[] }>
    ) => {
      state.data[String(action.payload.page)] = action.payload.notifications;
    },

    appendNotification: (
      state,
      action: PayloadAction<{ page?: number; notification: Notification }>
    ) => {
      const pageKey = action.payload.page ? String(action.payload.page) : "1";
      const current = state.data[pageKey] || [];
      state.data[pageKey] = [
        action.payload.notification,
        ...current.filter((n) => n.id !== action.payload.notification.id),
      ];
    },

    markAsRead: (state, action: PayloadAction<number>) => {
      Object.keys(state.data).forEach((page) => {
        state.data[page] = state.data[page].map((n) =>
          n.id === action.payload ? { ...n, is_read: true } : n
        );
      });
    },

    markAllAsRead: (state) => {
      Object.keys(state.data).forEach((page) => {
        state.data[page] = state.data[page].map((n) => ({
          ...n,
          is_read: true,
        }));
      });
    },

    removeNotification: (state, action: PayloadAction<number>) => {
      Object.keys(state.data).forEach((page) => {
        state.data[page] = state.data[page].filter(
          (n) => n.id !== action.payload
        );
      });
    },

    clearNotifications: (state) => {
      state.data = {};
      state.total = 0;
      state.error = "";
    },

    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
  },
});

// ---------------- Exports ----------------
export const {
  setNotificationsPage,
  appendNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  setTotal,
} = notificationSlice.actions;

export default notificationSlice.reducer;
