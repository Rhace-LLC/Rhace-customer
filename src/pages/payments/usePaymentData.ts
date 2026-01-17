import { getPaymentHistory } from "@/api-services/payments.service";
import { parseError } from "@/api-services/utils/parseError";
import { useAuth } from "@/contexts/AuthContext";
import {
  updateTransactionData,
  updateTransactionTotal,
} from "@/store/paymentTranxSlice";

import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

export function usePaymentData(page: number) {
  const dispatch = useDispatch();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch payments from API
      const res = await getPaymentHistory(auth.token, { page, pageSize: 8 }); // assuming API takes token and page

      // store paginated data
      dispatch(
        updateTransactionData({ key: String(page), data: res.payments })
      );

      // update total (replace with dynamic total from response if available)
      dispatch(updateTransactionTotal({ total: res.pagination.total_items }));
    } catch (err) {
      console.error(err);
      setError(parseError(err) || "Failed to fetch payments.");
    } finally {
      setLoading(false);
    }
  }, [auth, dispatch, page]);

  return {
    loading,
    error,
    fetchAllData,
  };
}
