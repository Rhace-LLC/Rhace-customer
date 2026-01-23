import {
  getActiveOrder,
  getUnpaidOrder,
  Order,
} from "@/api-services/order.service";
import { parseError } from "@/api-services/utils/parseError";
import React, { useCallback, useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export type DiningExperience = "personal" | "group";

export interface SmartResumeData {
  orderId: number;
  group: string | null;
  restaurantId: string;
  tableId: string;
  tableNumber: string;
}

export interface SelectedRestaurant {
  tableId: string | undefined;
  restaurantId: string | null;
  restaurantName: string | undefined;
  tableNo: string | undefined;
}

export interface SetupContextState {
  activeOrders: Order[];
  activeOrdersLoading: boolean;
  activeOrdersError: string | null;
  unpaidOrders: Order[];
  unpaidOrdersLoading: boolean;
  unpaidOrdersError: string | null;
  fetchActiveOrders: () => Promise<void>;
  fetchUnpaidOrders: () => Promise<void>;
  setupLoading: boolean;
  setSetupLoading: (loading: boolean) => void;
  selectedRestaurant: SelectedRestaurant | null;
  setSelectedRestaurant: React.Dispatch<
    React.SetStateAction<SelectedRestaurant | null>
  >;
  smartResumeData: SmartResumeData | null;
  preferredDiningExperience: DiningExperience | null;
  setPreferredDiningExperience: (value: DiningExperience) => void;
  resetDiningExperience: () => void;
  shouldPrompt: boolean;
  setShouldPrompt: (val: boolean) => void;
}

export const SetupContext = createContext<SetupContextState | undefined>({
  activeOrders: [],
  activeOrdersLoading: false,
  activeOrdersError: "",
  fetchActiveOrders: async () => {},
  unpaidOrders: [],
  unpaidOrdersLoading: false,
  unpaidOrdersError: null,
  fetchUnpaidOrders: async () => {},
  setupLoading: true,
  setSetupLoading: () => {},
  setSelectedRestaurant: () => {},
  selectedRestaurant: {
    tableId: undefined,
    tableNo: undefined,
    restaurantId: null,
    restaurantName: undefined,
  },
  smartResumeData: null,
  preferredDiningExperience: null,
  setPreferredDiningExperience: () => {},
  resetDiningExperience: () => {},
  shouldPrompt: false,
  setShouldPrompt: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const SetupProvider: React.FC<Props> = ({ children }) => {
  const { token } = useAuth();
  const [activeOrdersLoading, setActiveOrdersLoading] = useState(false);
  const [activeOrdersError, setActiveOrdersError] = useState<string | null>(
    null
  );
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [unpaidOrdersLoading, setUnpaidOrdersLoading] = useState(false);
  const [unpaidOrdersError, setUnpaidOrdersError] = useState<string | null>(
    null
  );
  const [unpaidOrders, setUnpaidOrders] = useState<Order[]>([]);
  const [setupLoading, setSetupLoading] = useState<boolean>(false);

  const [preferredDiningExperience, setPreferredDiningExperience] =
    useState<DiningExperience | null>(null);

  const [shouldPrompt, setShouldPrompt] = useState(false);

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<SelectedRestaurant | null>({
      tableId: undefined,
      tableNo: undefined,
      restaurantId: null,
      restaurantName: undefined,
    });

  const location = useLocation();

  const fetchActiveOrders = useCallback(async () => {
    if (!token) return;

    setActiveOrdersLoading(true);
    setActiveOrdersError(null);

    try {
      const response: { orders: Order[] } = await getActiveOrder(token);
      const active = response.orders.filter((x) => x.payment === "paid");
      setActiveOrders(active);
    } catch (err: any) {
      const errorMessage = parseError(err);

      setActiveOrdersError(errorMessage);
    } finally {
      setActiveOrdersLoading(false);
    }
  }, [token]);

  const [unpaidOrdersHasLoaded, setUnpaidOrdersHasLoaded] = useState(false);

  const fetchUnpaidOrders = useCallback(async () => {
    if (!token) return;

    setUnpaidOrdersLoading(true);
    setUnpaidOrdersError(null);

    try {
      const response = await getUnpaidOrder(token);
      setUnpaidOrders(response.orders);
      setUnpaidOrdersHasLoaded(true); // mark as loaded after successful fetch
    } catch (error) {
      const errorMessage = parseError(error);
      setUnpaidOrdersError(errorMessage);
      toast.error(errorMessage);
      setUnpaidOrdersHasLoaded(true); // even on error, we can mark it as attempted
    } finally {
      setUnpaidOrdersLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchActiveOrders();
    fetchUnpaidOrders();
  }, [token]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const tableId = searchParams.get("tid");
    const restaurantId = searchParams.get("rid");
    const restaurantName = searchParams.get("r");
    const tableNo = searchParams.get("tno") || "";

    if (tableId && restaurantId && restaurantName) {
      setSelectedRestaurant({
        tableId,
        restaurantId,
        restaurantName,
        tableNo,
      });
    }
  }, [location]);

  const smartResumeData = React.useMemo<SmartResumeData | null>(() => {
    if (!unpaidOrders.length) return null;

    const order = unpaidOrders[0];

    return {
      orderId: order.id,
      group: order.group,
      restaurantId:
        order?.restaurant_id || "57df8568-57ec-4117-bd54-1f2625ec6220",
      tableId: order.table,
      tableNumber: order.table_number,
    };
  }, [unpaidOrders]);

  const resetDiningExperience = () => {
    setPreferredDiningExperience(null);
    setShouldPrompt(false);
  };

  useEffect(() => {
    if (smartResumeData) {
      if (smartResumeData.group) {
        setPreferredDiningExperience("group");
      } else {
        setPreferredDiningExperience("personal");
      }
    }
  }, [smartResumeData]);
  // Prompt user to pick dining experience if no unpaid orders exist
  useEffect(() => {
    if (
      selectedRestaurant?.restaurantId &&
      selectedRestaurant.tableId &&
      unpaidOrdersHasLoaded &&
      unpaidOrders.length === 0
    ) {
      setShouldPrompt(true);
    } else {
      setShouldPrompt(false); // auto-hide if unpaid order exists
    }
  }, [unpaidOrdersHasLoaded, unpaidOrders.length, selectedRestaurant]);

  const value: SetupContextState = {
    activeOrders,
    activeOrdersLoading,
    activeOrdersError,
    fetchActiveOrders,
    unpaidOrders,
    unpaidOrdersLoading,
    unpaidOrdersError,
    fetchUnpaidOrders,
    setupLoading,
    setSetupLoading,
    selectedRestaurant,
    setSelectedRestaurant,
    smartResumeData,
    preferredDiningExperience,
    setPreferredDiningExperience,
    resetDiningExperience,
    shouldPrompt,
    setShouldPrompt,
  };

  return (
    <SetupContext.Provider value={value}>{children}</SetupContext.Provider>
  );
};

export const useSetupContext = (): SetupContextState => {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error("useSetupContext must be used within SetupProvider");
  }
  return context;
};
