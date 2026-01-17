import { getActiveOrder, Order } from "@/api-services/order.service";
import { useAuth } from "@/contexts/AuthContext";
import { setActiveOrder } from "@/store/orderCart.slice";
import { RootState } from "@/store/store";
import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useActiveOrder = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();

  const selectedRestaurant = useSelectedRestaurant();

  let activeOrder = useSelector(
    (state: RootState) => state.orderCart.activeOrder
  );

  activeOrder =
    activeOrder && activeOrder.length > 0
      ? activeOrder?.filter(
          (x) => x.restaurant_name === selectedRestaurant.restaurantName
        )
      : [];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveOrder = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response: { orders: Order[] } = await getActiveOrder(token);
      dispatch(setActiveOrder(response.orders));
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to fetch active order";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, dispatch]);

  return {
    activeOrder,
    fetchActiveOrder,
    loading,
    error,
  };
};
