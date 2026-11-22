import { useEffect, useRef } from "react";

/**
 * Dine-in flow: a guest submits an order → a waiter confirms it at the table
 * (back office, POST /orders/{id}/waiter-confirm) → only then can the guest
 * settle the bill.
 */

interface ConfirmableOrder {
  status?: string;
  payment?: string;
  waiter_confirmed?: boolean;
}

/**
 * True when an unpaid, live order is explicitly marked unconfirmed.
 *
 * Only an explicit `waiter_confirmed === false` blocks payment: if a payload
 * doesn't carry the field at all (e.g. an older serializer), we fall back to
 * the previous behaviour rather than lock the guest out of paying.
 */
export const isAwaitingWaiter = (order: ConfirmableOrder) =>
  order.waiter_confirmed === false &&
  order.payment !== "paid" &&
  order.status !== "cancelled";

export const anyAwaitingWaiter = (orders: ConfirmableOrder[] | undefined) =>
  (orders ?? []).some(isAwaitingWaiter);

/** How often to re-check while waiting for the waiter. */
export const WAITER_CONFIRMATION_POLL_MS = 15_000;

/**
 * Calls `refresh` every `intervalMs` while `active` is true, so the bill
 * section appears on its own once the waiter confirms. Also re-checks
 * immediately when the guest returns to the tab.
 */
export function usePollWhile(
  active: boolean,
  refresh: () => unknown,
  intervalMs = WAITER_CONFIRMATION_POLL_MS
) {
  // Keep the latest callback without restarting the interval each render.
  const refreshRef = useRef(refresh);
  useEffect(() => {
    refreshRef.current = refresh;
  });

  useEffect(() => {
    if (!active) return;

    const tick = () => {
      if (document.visibilityState === "visible") refreshRef.current();
    };
    const id = window.setInterval(tick, intervalMs);
    document.addEventListener("visibilitychange", tick);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [active, intervalMs]);
}
