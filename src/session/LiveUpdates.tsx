import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getNotifications, getUnreadCount } from "@/api-services/notification.service";
import { getActiveOrder, getUnpaidOrder, type Order, type OrderStatus } from "@/api-services/order.service";
import { useAuth } from "@/contexts/AuthContext";
import { usePolling } from "@/hooks/usePolling";
import { clearNotifications, setUnreadCount } from "@/store/notification.slice";
import type { RootState } from "@/store/store";
import { setUncompletedOrder, setUnpaidOrder } from "@/store/unpaidanduncompletedorder.slice";

/** Faster while food is on its way; slow heartbeat otherwise. */
const ORDER_POLL_ACTIVE = 15_000;
const ORDER_POLL_IDLE = 120_000;
const NOTIFICATION_POLL = 45_000;

const STATUS_TOAST: Partial<Record<OrderStatus, { title: string; body: string }>> = {
  preparing: { title: "Your order is being prepared", body: "The kitchen has started on it." },
  delivered: { title: "Your order is on the table", body: "Enjoy your meal!" },
  completed: { title: "Order completed", body: "Thanks for dining with us." },
  cancelled: { title: "Your order was cancelled", body: "Ask a waiter if this looks wrong." },
};

const buzz = () => {
  try {
    navigator.vibrate?.(120);
  } catch {
    /* not supported */
  }
};

/**
 * Keeps orders and notifications fresh without websockets: visibility-aware
 * polling (see usePolling), with a toast whenever an order changes status or
 * a new notification arrives. Mounted once for the whole app.
 */
export function LiveUpdates() {
  const { token } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const unpaid = useSelector((s: RootState) => s.unpaid_uncompleted_orders.unpaidOrders);
  const active = useSelector((s: RootState) => s.unpaid_uncompleted_orders.uncompletedOrders);
  const hasOpenOrders = unpaid.length + active.length > 0;

  // ── Orders ────────────────────────────────────────────────────────────
  const lastStatus = useRef<Map<number, OrderStatus> | null>(null);
  const lastSeenId = useRef<number | null>(null);

  // A different guest (or a logout) starts from a clean slate.
  useEffect(() => {
    lastStatus.current = null;
    lastSeenId.current = null;
  }, [token]);

  usePolling(
    async () => {
      if (!token) return;
      const [activeRes, unpaidRes] = await Promise.all([getActiveOrder(token), getUnpaidOrder(token)]);
      const paid = activeRes.orders.filter((o) => o.payment === "paid");
      dispatch(setUncompletedOrder(paid));
      dispatch(setUnpaidOrder(unpaidRes.orders));

      // Every order the guest has open, newest status wins.
      const seen = new Map<number, Order>();
      for (const order of [...unpaidRes.orders, ...activeRes.orders]) seen.set(order.id, order);

      // Compare with the last poll, or on the first one with what the app
      // loaded at start-up, so a change in between still gets announced.
      const loaded = [...unpaid, ...active];
      const previous =
        lastStatus.current ??
        (loaded.length ? new Map(loaded.map((o) => [o.id, o.status] as const)) : null);
      lastStatus.current = new Map([...seen].map(([id, o]) => [id, o.status]));
      if (!previous) return; // nothing to compare with yet

      for (const [id, order] of seen) {
        const before = previous.get(id);
        const message = STATUS_TOAST[order.status];
        if (before && before !== order.status && message) {
          buzz();
          toast.info(message.title, {
            description: `Order #${id} · ${message.body}`,
            action: { label: "View", onClick: () => navigate("/orders/active") },
          });
        }
      }
    },
    { interval: hasOpenOrders ? ORDER_POLL_ACTIVE : ORDER_POLL_IDLE, enabled: Boolean(token) },
  );

  // ── Notifications ─────────────────────────────────────────────────────
  const unreadCount = useSelector((s: RootState) => s.notifications.unreadCount);
  const countRef = useRef(unreadCount);
  countRef.current = unreadCount;

  usePolling(
    async () => {
      if (!token) return;
      const { unread_count } = await getUnreadCount(token);
      const grew = unread_count > countRef.current;
      const firstRun = lastSeenId.current === null;

      if (grew || firstRun) {
        const latest = await getNotifications(1, 5, token);
        const newest = latest.results[0]?.id ?? 0;
        if (!firstRun) {
          const fresh = latest.results.filter((n) => !n.is_read && n.id > (lastSeenId.current ?? 0));
          for (const n of fresh.slice(0, 2).reverse()) {
            toast(n.title, {
              description: n.message,
              action: { label: "Open", onClick: () => navigate("/notifications") },
            });
          }
          if (fresh.length) buzz();
          // The notifications page caches pages; drop them so it shows the new ones.
          dispatch(clearNotifications());
        }
        lastSeenId.current = Math.max(newest, lastSeenId.current ?? 0);
      }
      dispatch(setUnreadCount(unread_count));
    },
    { interval: NOTIFICATION_POLL, enabled: Boolean(token), immediate: true },
  );

  return null;
}
