import {
  getDiningGroupBillSummary,
} from "@/api-services/billsettlement.service";
import { parseError } from "@/api-services/utils/parseError";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupOrder } from "@/hooks/useDineGroupOrder";
import { clearBill, setBill } from "@/store/groupbill.slice";
import { RootState } from "@/store/store";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useGroupBill = () => {
  const auth = useAuth();
  const { groupOrder } = useGroupOrder();
  const dispatch = useDispatch();

  const groupBill = useSelector(
    (state: RootState) => state.groupBill.bill
  );

  const [groupBillLoading, setGroupBillLoading] = useState(false);
  const [groupBillError, setGroupBillError] = useState<string | null>(null);

  const fetchGroupBill = useCallback(async () => {
    if (!groupOrder?.id || !auth.token) return;

    setGroupBillLoading(true);
    setGroupBillError(null);

    try {
      const response = await getDiningGroupBillSummary(
        groupOrder.id,
        auth.token
      );

      dispatch(setBill(response.bill));
    } catch (error: any) {
      const errorMessage = parseError(error);
      setGroupBillError(errorMessage || "Something went wrong");
      dispatch(clearBill());
    } finally {
      setGroupBillLoading(false);
    }
  }, [groupOrder?.id, auth.token, dispatch]);

  const groupBillRefresh = useCallback(async () => {
    if (!groupOrder?.id || !auth.token) return;

    try {
      const response = await getDiningGroupBillSummary(
        groupOrder.id,
        auth.token
      );

      dispatch(setBill(response.bill));
    } catch (error: any) {
      dispatch(clearBill());
    }
  }, [groupOrder?.id, auth.token, dispatch]);

  return {
    groupBill,
    groupBillLoading,
    groupBillError,
    fetchGroupBill,
    groupBillRefresh
  };
};
