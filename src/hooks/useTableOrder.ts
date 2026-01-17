import { getTableOrder } from "@/api-services/order.service";
import { useAuth } from "@/contexts/AuthContext";
import { RootState } from "@/store/store";
import { setTableOrder } from "@/store/table_order.slice";
import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useTableOrder = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const selectedRestaurant = useSelectedRestaurant();

  const tableOrder = useSelector((state: RootState) => state.table_order);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTableOrder = useCallback(async () => {
    if (!selectedRestaurant?.tableId || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getTableOrder(selectedRestaurant.tableId, token);

      dispatch(
        setTableOrder({
          tableId: response.data.table_id,
          tableNumber: response.data.table_number,
          orders: response.data.orders,
          totalAmount: response.data.total_amount,
        })
      );
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to fetch table order";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch, selectedRestaurant?.tableId, token]);

  return {
    tableOrder,
    fetchTableOrder,
    loading,
    error,
  };
};
