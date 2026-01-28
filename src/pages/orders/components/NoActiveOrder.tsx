import { UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const EmptyOrderState = () => {
  return (
    <div className="flex min-h-[450px] w-full flex-col items-center justify-center bg-transparent px-6 py-12">
      <div className="flex w-full max-w-[320px] flex-col items-center text-center">
        
        {/* ICON ARCHITECTURE: THE LAYERED LOOK */}
        <div className="relative mb-10 flex items-center justify-center">
          {/* Background decorative ring */}
          <div className="absolute h-20 w-20 animate-pulse rounded-full bg-gray-50" />
          
          <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100">
            <UtensilsCrossed 
              size={28} 
              strokeWidth={1.5} 
              className="text-gray-400" 
            />
          </div>
        </div>

        {/* TYPOGRAPHY: CLEAN HIERARCHY */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight text-gray-900">
            No active order found
          </h3>
          <p className="text-[14px] font-medium leading-relaxed text-gray-400">
            Your tray is currently empty. Orders will appear here once you’ve selected items from the menu.
          </p>
        </div>

        {/* PRIMARY ACTION */}
        <div className="mt-10 w-full space-y-4">
            <Link to={'/menu'}>
          <Button
            className="h-12 w-full rounded-2xl bg-black text-[13px] font-bold tracking-wide text-white transition-all hover:bg-gray-800 active:scale-[0.98] shadow-lg shadow-black/5"
          >
            Browse Menu
          </Button>
            </Link>
          
          {/* SECONDARY LINK: MINIMALIST STYLE */}
          <button className="group flex items-center justify-center gap-2 text-[12px] font-bold tracking-tight text-gray-300 transition-colors hover:text-blue-500">
            <span>Check order history</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};