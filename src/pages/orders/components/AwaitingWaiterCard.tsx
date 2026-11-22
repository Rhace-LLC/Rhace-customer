import { useState } from "react";
import { BellRing, RefreshCcw } from "lucide-react";

interface AwaitingWaiterCardProps {
  /** Re-fetch the order(s) now instead of waiting for the next auto-check. */
  onCheckNow: () => unknown;
  /** Group dining: payment waits on every order in the group. */
  isGroup?: boolean;
}

/**
 * Shown in place of the "Settle Bill" section until a waiter has confirmed
 * the order at the table. The page re-checks automatically in the background
 * (see usePollWhile), so this swaps to the bill section on its own.
 */
export const AwaitingWaiterCard = ({
  onCheckNow,
  isGroup = false,
}: AwaitingWaiterCardProps) => {
  const [checking, setChecking] = useState(false);

  const handleCheckNow = async () => {
    if (checking) return;
    setChecking(true);
    try {
      await onCheckNow();
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mt-6 duration-500">
      <div className="mb-6 h-px w-full bg-gray-100" />

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-100">
            <span className="absolute inset-0 animate-ping rounded-full bg-amber-100 opacity-40" />
            <BellRing size={20} strokeWidth={1.75} className="relative" />
          </div>

          <div className="space-y-1.5">
            <p className="text-[16px] font-semibold tracking-tight text-gray-900">
              Waiting for your waiter
            </p>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-500">
              {isGroup
                ? "You’ll be able to settle the bill once the waiter comes to confirm your table’s orders."
                : "You’ll be able to pay once the waiter comes to confirm your order."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCheckNow}
            disabled={checking}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-5 text-[13px] font-medium text-gray-600 ring-1 ring-gray-200 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-60"
          >
            <RefreshCcw size={14} className={checking ? "animate-spin" : ""} />
            {checking ? "Checking…" : "Check now"}
          </button>

          <p className="text-[11px] text-gray-400">
            This updates automatically.
          </p>
        </div>
      </div>
    </div>
  );
};
