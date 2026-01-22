import {
  Bill,
  getDiningGroupBillSummary,
} from "@/api-services/billsettlement.service";
import { parseError } from "@/api-services/utils/parseError";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupOrder } from "@/hooks/useDineGroupOrder";
import { useState, useCallback } from "react"; // adjust your import

export const useGroupBill = () => {
  const auth = useAuth();
  const { groupOrder } = useGroupOrder();
  const [groupBill, setGroupBillResponse] = useState<Bill | null>(null);
  const [groupBillLoading, setGroupBillLoading] = useState(false);
  const [groupBillError, setGroupBillError] = useState<string | null>(null);

  const fetchGroupBill = useCallback(async () => {
    if (!groupOrder?.id || !auth.token) return;

    setGroupBillLoading(true);
    setGroupBillError(null);

    try {
      const response = await getDiningGroupBillSummary(
        groupOrder?.id || "",
        auth.token
      );
      setGroupBillResponse(response.bill);
      setGroupBillLoading(false);
    } catch (error: any) {
      const errorMessage = parseError(error);
      setGroupBillError(errorMessage || "Something went wrong");
      setGroupBillLoading(false);
    }
  }, [groupOrder, auth.token]);

  return {
    groupBill,
    groupBillLoading,
    groupBillError,
    fetchGroupBill,
  };
};
