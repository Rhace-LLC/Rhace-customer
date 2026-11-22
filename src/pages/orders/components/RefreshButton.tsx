import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
  /** Re-fetch the page's orders / bill. May return a promise. */
  onRefresh: () => unknown;
  className?: string;
}

/**
 * Manual refresh for the Orders page — lets guests check right away whether
 * the waiter has confirmed their order (which unlocks Settle Bill), instead
 * of waiting for the automatic re-check.
 */
export const RefreshButton = ({ onRefresh, className }: RefreshButtonProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleClick = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={refreshing}
      aria-label="Refresh orders"
      title="Refresh orders"
      className={cn(
        "flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-[13px] font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 disabled:cursor-default disabled:opacity-60",
        // Small phones (≤400px): square icon-only button so the header fits.
        "max-[400px]:w-12 max-[400px]:px-0",
        className
      )}
    >
      <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} />
      {/* Visually hidden on small phones but still announced by screen readers. */}
      <span className="max-[400px]:sr-only">
        {refreshing ? "Refreshing…" : "Refresh"}
      </span>
    </button>
  );
};
