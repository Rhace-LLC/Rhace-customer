// src/hooks/useNotificationData.ts
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "@/contexts/AuthContext";
import {
  setNotificationsPage,
  setTotal,
  Notification,
} from "@/store/notification.slice";
import { getNotifications } from "@/api-services/notification.service";

export function useNotificationData(page: number, page_size = 10) {
  const dispatch = useDispatch();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getNotifications(page, page_size, auth.token);

      const notifications: Notification[] = res.results;

      // Store paginated data in Redux
      dispatch(setNotificationsPage({ page, notifications }));

      // Update total count
      dispatch(setTotal(res.count));
    } catch (err) {
      console.error(err);
      const message = "Failed to fetch notifications.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [auth, dispatch, page, page_size]);

  return {
    loading,
    error,
    fetchAllData,
  };
}
