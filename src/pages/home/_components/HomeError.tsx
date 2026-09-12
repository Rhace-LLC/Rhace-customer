import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeErrorProps {
  message: string;
  onRetry: () => void;
}

/** Error state for the restaurant profile fetch. */
export function HomeError({ message, onRetry }: HomeErrorProps) {
  return (
    <div className="animate-in zoom-in-95 flex flex-col items-center justify-center py-20 text-center duration-500">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50">
        <AlertCircle className="text-rose-500" size={28} strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        System Sync Error
      </h2>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed font-medium text-gray-400">
        {message}
      </p>
      <Button
        onClick={onRetry}
        className="mt-8 h-14 w-full max-w-60 rounded-2xl bg-gray-900 text-[15px] font-bold text-white shadow-xl shadow-black/10 transition-all active:scale-95"
      >
        Retry Connection
      </Button>
    </div>
  );
}
