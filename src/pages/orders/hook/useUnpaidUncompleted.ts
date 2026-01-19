import { useState, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getActiveOrder, getUnpaidOrder } from "@/api-services/order.service";
import {
  setUncompletedOrder,
  setUnpaidOrder,
} from "@/store/unpaidanduncompletedorder.slice";
import { parseError } from "@/api-services/utils/parseError";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useUnpaidUncompleted = () => {
  const auth = useAuth();
  const dispatch = useDispatch();

  // Redux selectors
  const unpaidOrders = useSelector(
    (state: RootState) => state.unpaid_uncompleted_orders.unpaidOrders
  );
  const uncompletedOrders = useSelector(
    (state: RootState) => state.unpaid_uncompleted_orders.uncompletedOrders
  );

  // Loading & error state
  const [activeOrderLoading, setActiveOrderLoading] = useState(false);
  const [activeOrderError, setActiveOrderError] = useState<string | null>(null);

  const [unpaidOrderLoading, setUnpaidOrderLoading] = useState(false);
  const [unpaidOrderError, setUnpaidOrderError] = useState<string | null>(null);

  // Fetch active (paid) orders
  const getUserActiveOrder = useCallback(async () => {
    if (!auth.token) return;

    setActiveOrderLoading(true);
    setActiveOrderError(null);

    try {
      const response = await getActiveOrder(auth.token);
      const active = response.orders.filter((x) => x.payment === "paid");
      dispatch(setUncompletedOrder(active));
    } catch (error) {
      const errorMessage = parseError(error);
      setActiveOrderError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActiveOrderLoading(false);
    }
  }, [auth.token, dispatch]);

  // Fetch unpaid orders
  const getUserUnpaidOrder = useCallback(async () => {
    if (!auth.token) return;

    setUnpaidOrderLoading(true);
    setUnpaidOrderError(null);

    try {
      const response = await getUnpaidOrder(auth.token);
      dispatch(setUnpaidOrder(response.orders));
    } catch (error) {
      const errorMessage = parseError(error);
      setUnpaidOrderError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUnpaidOrderLoading(false);
    }
  }, [auth.token, dispatch]);

  return {
    // redux state
    unpaidOrders,
    uncompletedOrders,

    // loading / error states
    unpaidOrderLoading,
    unpaidOrderError,
    activeOrderLoading,
    activeOrderError,

    // request functions
    getUserUnpaidOrder,
    getUserActiveOrder,
  };
};
