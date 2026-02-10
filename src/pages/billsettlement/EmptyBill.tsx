import { ReceiptText, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const EmptyBillState = () => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        {/* ICON ARCHITECTURE */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gray-50 ring-1 ring-gray-100 transition-transform duration-500 hover:scale-105">
          {/* Subtle floating decorative element */}
          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-white shadow-sm ring-1 ring-gray-100" />

          <ReceiptText
            size={42}
            strokeWidth={1.2}
            className="text-gray-300 transition-colors duration-300 group-hover:text-gray-400"
          />
        </div>

        {/* TYPOGRAPHY */}
        <h3 className="text-xl font-bold tracking-tight text-gray-900">
          No bill detected
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed font-medium text-gray-400">
          It looks like there are no active items at this table yet. Start
          adding orders to generate a summary.
        </p>

        {/* ACTION */}
        <Link to={"/menu"}>
          <Button className="group mt-10 h-12 rounded-2xl bg-black px-8 text-[14px] font-bold tracking-tight text-white shadow-xl shadow-black/5 transition-all hover:bg-gray-800 active:scale-95">
            <Utensils
              size={16}
              className="mr-2 transition-transform group-hover:rotate-90"
            />
            Explore Menu
          </Button>
        </Link>

        {/* SECONDARY LINK */}
        <button className="mt-6 hidden text-[13px] font-bold text-gray-300 transition-colors hover:text-gray-900">
          Sync table status
        </button>
      </div>
    </div>
  );
};
