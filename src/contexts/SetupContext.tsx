import { getCurrentGroup, type DiningGroup } from "@/api-services/dininggroup.service";
import { getActiveOrder, getUnpaidOrder, Order } from "@/api-services/order.service";
import { parseError } from "@/api-services/utils/parseError";
import { loadDiningSession, saveDiningSession } from "@/lib/diningSession";
import { clearBill } from "@/store/groupbill.slice";
import { clearGroupOrder, setGroupOrder } from "@/store/group_order.slice";
import type { RootState } from "@/store/store";
import {
  setUncompletedOrder,
  setUnpaidOrder,
} from "@/store/unpaidanduncompletedorder.slice";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

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
  setSelectedRestaurant: React.Dispatch<React.SetStateAction<SelectedRestaurant | null>>;
  smartResumeData: SmartResumeData | null;
  preferredDiningExperience: DiningExperience | null;
  setPreferredDiningExperience: (value: DiningExperience | null) => void;
  resetDiningExperience: () => void;
  shouldPrompt: boolean;
  setShouldPrompt: (val: boolean) => void;
  leaveGroupDining: () => void;
  /** The group the server says this guest is in (null when none). */
  currentGroup: DiningGroup | null;
  /** True once the refresh-resume checks (open orders + group) have finished. */
  resumeReady: boolean;
  /** After leaving a group: forget the group and ask how to dine again. */
  endGroupSession: () => void;
  /** After creating or joining a group, so the session (and refresh) knows. */
  groupJoined: (group: DiningGroup) => void;
}

const EMPTY_SELECTION: SelectedRestaurant = {
  tableId: undefined,
  tableNo: undefined,
  restaurantId: null,
  restaurantName: undefined,
};

export const SetupContext = createContext<SetupContextState | undefined>(undefined);

const NO_GROUP = "No DiningGroup matches the given query.";

/** Table details carried by an open order, for guests who refresh without a QR link. */
function selectionFromOrder(order: Order | undefined): SelectedRestaurant | null {
  if (!order?.table || !order.restaurant_id) return null;
  return {
    tableId: String(order.table),
    restaurantId: order.restaurant_id,
    restaurantName: order.restaurant_name,
    tableNo: order.table_number ?? "",
  };
}

interface Props {
  children: React.ReactNode;
}

/**
 * The guest's table session. On a refresh it resumes, in this order:
 *  1. the table: QR link in the URL > saved session > the table of an open order;
 *  2. how they dine: active group on the server > open order > saved choice;
 *  3. only if nothing is known does it ask "How would you like to dine?".
 * Orders live in Redux (one copy for every screen); this context loads them.
 */
export const SetupProvider: React.FC<Props> = ({ children }) => {
  const { token } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const saved = useRef(loadDiningSession());

  const unpaidOrders = useSelector((s: RootState) => s.unpaid_uncompleted_orders.unpaidOrders);
  const activeOrders = useSelector((s: RootState) => s.unpaid_uncompleted_orders.uncompletedOrders);

  const [activeOrdersLoading, setActiveOrdersLoading] = useState(false);
  const [activeOrdersError, setActiveOrdersError] = useState<string | null>(null);
  const [unpaidOrdersLoading, setUnpaidOrdersLoading] = useState(false);
  const [unpaidOrdersError, setUnpaidOrdersError] = useState<string | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);

  const [unpaidChecked, setUnpaidChecked] = useState(false);
  const [groupChecked, setGroupChecked] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<DiningGroup | null>(null);

  const [selectedRestaurant, setSelectedRestaurant] = useState<SelectedRestaurant | null>(
    () => saved.current?.selection ?? EMPTY_SELECTION,
  );
  const [preferredDiningExperience, setPreferredDiningExperience] =
    useState<DiningExperience | null>(() => saved.current?.preference ?? null);
  // A choice restored from the saved session was already confirmed once.
  const [promptDismissed, setPromptDismissed] = useState(() => Boolean(saved.current?.preference));

  // ── Loading ───────────────────────────────────────────────────────────

  const fetchActiveOrders = useCallback(async () => {
    if (!token) return;
    setActiveOrdersLoading(true);
    setActiveOrdersError(null);
    try {
      const response = await getActiveOrder(token);
      dispatch(setUncompletedOrder(response.orders.filter((x) => x.payment === "paid")));
    } catch (err) {
      setActiveOrdersError(parseError(err));
    } finally {
      setActiveOrdersLoading(false);
    }
  }, [token, dispatch]);

  const fetchUnpaidOrders = useCallback(async () => {
    if (!token) return;
    setUnpaidOrdersLoading(true);
    setUnpaidOrdersError(null);
    try {
      const response = await getUnpaidOrder(token);
      dispatch(setUnpaidOrder(response.orders));
    } catch (error) {
      setUnpaidOrdersError(parseError(error));
    } finally {
      setUnpaidOrdersLoading(false);
      setUnpaidChecked(true);
    }
  }, [token, dispatch]);

  const fetchCurrentGroup = useCallback(async () => {
    if (!token) return;
    try {
      const group = await getCurrentGroup(token);
      const live = group && group.active !== false ? group : null;
      setCurrentGroup(live);
      if (live) dispatch(setGroupOrder({ group: live }));
    } catch (err) {
      // "No group" is the normal answer for solo diners; anything else is
      // treated the same way so a flaky call never blocks the app.
      if (parseError(err) !== NO_GROUP) console.warn("Group check failed:", err);
      setCurrentGroup(null);
    } finally {
      setGroupChecked(true);
    }
  }, [token, dispatch]);

  // Boot / login: one round of resume checks. Logout: forget everything.
  useEffect(() => {
    if (!token) {
      setSelectedRestaurant(EMPTY_SELECTION);
      setPreferredDiningExperience(null);
      setCurrentGroup(null);
      setUnpaidChecked(false);
      setGroupChecked(false);
      setPromptDismissed(false);
      dispatch(setUnpaidOrder([]));
      dispatch(setUncompletedOrder([]));
      dispatch(clearGroupOrder());
      dispatch(clearBill());
      return;
    }
    fetchActiveOrders();
    fetchUnpaidOrders();
    fetchCurrentGroup();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Table selection ───────────────────────────────────────────────────

  // A QR link always wins. Scanning a different table starts a new session.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableId = params.get("tid");
    const restaurantId = params.get("rid");
    const restaurantName = params.get("r");
    if (!tableId || !restaurantId || !restaurantName) return;
    setSelectedRestaurant((prev) => {
      if (prev?.tableId && prev.tableId !== tableId) {
        setPreferredDiningExperience(null);
        setPromptDismissed(false);
      }
      return { tableId, restaurantId, restaurantName, tableNo: params.get("tno") || "" };
    });
  }, [location.search]);

  // No QR link and nothing saved: fall back to the table of an open order.
  useEffect(() => {
    if (selectedRestaurant?.tableId) return;
    const fromOrder = selectionFromOrder(unpaidOrders[0] ?? activeOrders[0]);
    if (fromOrder) setSelectedRestaurant(fromOrder);
  }, [selectedRestaurant?.tableId, unpaidOrders, activeOrders]);

  // ── Dining preference ─────────────────────────────────────────────────

  const smartResumeData = useMemo<SmartResumeData | null>(() => {
    const order = unpaidOrders[0];
    if (!order) return null;
    return {
      orderId: order.id,
      group: order.group,
      restaurantId: order.restaurant_id,
      tableId: order.table,
      tableNumber: order.table_number,
    };
  }, [unpaidOrders]);

  // The server is the source of truth: being in an active group means group
  // dining; otherwise an open order means personal dining. (An order's own
  // `group` field is ignored: it stays set after the guest leaves the group.)
  useEffect(() => {
    if (currentGroup) setPreferredDiningExperience("group");
    else if (groupChecked && smartResumeData) setPreferredDiningExperience("personal");
  }, [currentGroup, groupChecked, smartResumeData]);

  // Persist the session so the next refresh resumes without asking again.
  useEffect(() => {
    if (!token) return;
    const selection = selectedRestaurant?.tableId && selectedRestaurant.restaurantId
      ? {
          tableId: selectedRestaurant.tableId,
          restaurantId: selectedRestaurant.restaurantId,
          restaurantName: selectedRestaurant.restaurantName ?? "",
          tableNo: selectedRestaurant.tableNo ?? "",
        }
      : null;
    saveDiningSession(selection ? { selection, preference: preferredDiningExperience } : null);
  }, [token, selectedRestaurant, preferredDiningExperience]);

  const resumeReady = !token || (unpaidChecked && groupChecked);

  // Ask only when we're at a table, every resume check is done, and nothing
  // told us how this guest is dining. Confirming the choice dismisses it.
  const shouldPrompt =
    resumeReady &&
    Boolean(selectedRestaurant?.restaurantId && selectedRestaurant.tableId) &&
    !promptDismissed &&
    !currentGroup &&
    unpaidOrders.length === 0;

  const setShouldPrompt = useCallback((val: boolean) => setPromptDismissed(!val), []);

  const leaveGroupDining = useCallback(() => {
    setCurrentGroup(null);
    dispatch(clearGroupOrder());
    dispatch(clearBill());
    setPreferredDiningExperience("personal");
    fetchUnpaidOrders();
  }, [dispatch, fetchUnpaidOrders]);

  const groupJoined = useCallback(
    (group: DiningGroup) => {
      setCurrentGroup(group);
      dispatch(setGroupOrder({ group }));
      setPreferredDiningExperience("group");
    },
    [dispatch],
  );

  const endGroupSession = useCallback(() => {
    setCurrentGroup(null);
    dispatch(clearGroupOrder());
    dispatch(clearBill());
    setPreferredDiningExperience(null);
    setPromptDismissed(false);
    fetchUnpaidOrders();
  }, [dispatch, fetchUnpaidOrders]);

  const resetDiningExperience = useCallback(() => {
    setPreferredDiningExperience(null);
    setPromptDismissed(true);
  }, []);

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
    leaveGroupDining,
    currentGroup,
    resumeReady,
    endGroupSession,
    groupJoined,
  };

  return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
};

export const useSetupContext = (): SetupContextState => {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error("useSetupContext must be used within SetupProvider");
  }
  return context;
};
