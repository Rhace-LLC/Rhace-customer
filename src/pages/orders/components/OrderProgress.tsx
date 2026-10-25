import { Check, ChefHat, ClipboardCheck, Utensils, XCircle } from "lucide-react";
import moment from "moment";
import type { Order, OrderStatus } from "@/api-services/order.service";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Received", icon: ClipboardCheck },
  { label: "Preparing", icon: ChefHat },
  { label: "Served", icon: Utensils },
  { label: "Done", icon: Check },
] as const;

const STEP_INDEX: Record<OrderStatus, number> = {
  received: 0,
  paid: 0,
  preparing: 1,
  delivered: 2,
  completed: 3,
  cancelled: -1,
};

/** One-line, guest-friendly wait estimate, or null when we don't know. */
function waitLabel(order: Pick<Order, "status" | "ready_at" | "estimated_wait_minutes">): string | null {
  if (order.status === "delivered" || order.status === "completed" || order.status === "cancelled") return null;
  if (order.ready_at) {
    const minutes = moment(order.ready_at).diff(moment(), "minutes");
    if (minutes <= 0) return "Almost ready";
    return `Ready in about ${minutes} min`;
  }
  if (order.estimated_wait_minutes > 0) return `About ${order.estimated_wait_minutes} min wait`;
  return null;
}

/**
 * Step tracker for one order. Updates on its own as LiveUpdates polls the
 * order status, so guests can watch it move without refreshing.
 */
export function OrderProgress({
  order,
  compact = false,
}: {
  order: Pick<Order, "id" | "status" | "ready_at" | "estimated_wait_minutes">;
  compact?: boolean;
}) {
  const current = STEP_INDEX[order.status] ?? 0;

  if (current < 0) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-red-700">
        <XCircle size={16} />
        <p className="text-[13px] font-semibold">This order was cancelled. Ask a waiter if this looks wrong.</p>
      </div>
    );
  }

  const wait = waitLabel(order);

  return (
    <div className="space-y-3">
      <ol className="flex items-center" aria-label={`Order #${order.id} progress`}>
        {STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const Icon = step.icon;
          return (
            <li key={step.label} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full transition-colors",
                    compact ? "h-7 w-7" : "h-9 w-9",
                    done && "bg-emerald-500 text-white",
                    active && "bg-blue-600 text-white ring-4 ring-blue-100",
                    !done && !active && "bg-gray-100 text-gray-400",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? <Check size={compact ? 13 : 15} strokeWidth={3} /> : <Icon size={compact ? 13 : 15} />}
                </span>
                {!compact && (
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      active ? "text-gray-900" : done ? "text-gray-600" : "text-gray-400",
                    )}
                  >
                    {step.label}
                  </span>
                )}
              </div>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn("mx-1 h-0.5 flex-1 rounded-full", i < current ? "bg-emerald-500" : "bg-gray-100", !compact && "-mt-5")}
                />
              )}
            </li>
          );
        })}
      </ol>
      {wait && (
        <p className="text-[12px] font-medium text-gray-500">
          {wait}
          <span className="text-gray-400"> · updates automatically</span>
        </p>
      )}
    </div>
  );
}
