import { getCurrentGroup } from "@/api-services/dininggroup.service";
import { useAuth } from "@/contexts/AuthContext";
import { setGroupOrder } from "@/store/group_order.slice";
import { RootState } from "@/store/store";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useGroupOrder = () => {
  const dispatch = useDispatch();
  const { token } = useAuth();

  const groupOrder = useSelector((state: RootState) => state.group_order.group);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupOrder = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getCurrentGroup(token);

      dispatch(
        setGroupOrder({
          group: response,
          totalAmount: 0, // derive later
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
  }, [dispatch, token]);

  return {
    groupOrder,
    fetchGroupOrder,
    loading,
    error,
  };
};
