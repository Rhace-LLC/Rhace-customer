import { DollarSign, Users } from "lucide-react";

import { useEffect, useState } from "react";
import { getMyCurrentBill } from "@/api-services/billsettlement.service";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type Diner = {
  id: number;
  name: string;
  initials: string;
  items: number;
  total: number;
};

const OTHER_DINERS: Diner[] = [
  { id: 1, name: "John Doe", initials: "JD", items: 3, total: 7200 },
  { id: 2, name: "Mary Obi", initials: "MO", items: 3, total: 7200 },
  { id: 3, name: "Kemi Ade", initials: "KA", items: 3, total: 7200 },
];

const MY_TOTAL = 10500;
const BillSettlement = () => {
  const auth = useAuth();
  const [addedDiners, setAddedDiners] = useState<Diner[]>([]);

  const toggleDiner = (diner: Diner) => {
    setAddedDiners((prev) =>
      prev.some((d) => d.id === diner.id)
        ? prev.filter((d) => d.id !== diner.id)
        : [...prev, diner]
    );
  };

  const totalToPay =
    MY_TOTAL + addedDiners.reduce((sum, d) => sum + d.total, 0);

  const billingText =
    addedDiners.length === 0
      ? "You’ll only be charged for what you ordered."
      : `You’ll be billed for yourself and ${addedDiners
          .map((d) => d.name)
          .join(", ")}.`;

  const fetchMyBill = async () => {
    return await getMyCurrentBill(auth.token);
  };

  useEffect(() => {
    fetchMyBill();
  }, []);

  return (
<div className="mx-auto max-w-2xl space-y-12 px-4 py-8">
  {/* SECTION: INTRO */}
  <div className="space-y-2 mb-4">
    <h1 className="text-3xl font-semibold tracking-tighter text-gray-900">Checkout</h1>
    <p className="text-[15px] leading-relaxed text-gray-400">
      Review your selection and choose how you’d like to settle the bill.
    </p>
  </div>

  {/* SECTION: THE BILL (YOUR ORDER) */}
  <div className="relative rounded-[0.5rem] border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 text-gray-900">
          <DollarSign size={18} strokeWidth={2} />
        </div>
        <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">Your Summary</h3>
      </div>
      <span className="rounded-full bg-blue-50 px-4 py-1.5 text-[13px] font-semibold text-blue-600">
        Personal
      </span>
    </div>

    {/* ITEMS LIST */}
    <div className="space-y-4">
      <div className="flex justify-between text-[14px]">
        <span className="text-gray-600">Jollof Rice <span className="ml-2 text-[13px] text-gray-400 font-medium">× 2</span></span>
        <span className="font-semibold text-gray-900">₦6,000</span>
      </div>
      <div className="flex justify-between text-[14px]">
        <span className="text-gray-600">Grilled Chicken <span className="ml-2 text-[13px] text-gray-400 font-medium">× 1</span></span>
        <span className="font-semibold text-gray-900">₦4,500</span>
      </div>
    </div>

    {/* CHARGES DOCK */}
    <div className="pt-3 mt-3 space-y-3 border-t border-gray-200">
      <div className="flex justify-between text-[14px] text-gray-500">
        <span>Subtotal</span>
        <span className="font-medium tabular-nums">₦10,500</span>
      </div>
      <div className="flex justify-between text-[14px] text-gray-500">
        <span>Tax & Service</span>
        <span className="font-medium tabular-nums">₦0</span>
      </div>
      <div className="mt-2 border-t border-gray-100 pt-3 flex justify-between text-[16px] font-semibold text-gray-900">
        <span>Total Due</span>
        <span className="tracking-tight tabular-nums">₦10,500</span>
      </div>
    </div>
  </div>

  {/* SECTION: OTHER DINERS */}
  <div className="space-y-6">
    <div className="flex items-end justify-between px-2">
      <div className="space-y-1">
        <h4 className="text-[16px] font-semibold tracking-tight text-gray-900">Other Diners</h4>
        <p className="text-[14px] text-gray-400">Cover a friend’s bill or keep it separate.</p>
      </div>
      <Users size={20} className="mb-1 text-gray-300" />
    </div>

    <div className="space-y-4">
      {OTHER_DINERS.map((diner) => {
        const isAdded = addedDiners.some((d) => d.id === diner.id);
        return (
          <div
            key={diner.id}
            className={cn(
              "flex items-center justify-between rounded-[2rem] border p-5 transition-all duration-300",
              isAdded ? "border-black bg-black text-white shadow-xl shadow-black/10" : "border-gray-100 bg-white"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl text-[13px] font-semibold",
                isAdded ? "bg-white/10 text-white" : "bg-gray-900 text-white"
              )}>
                {diner.initials}
              </div>
              <div>
                <p className="text-[14px] font-semibold tracking-tight">{diner.name}</p>
                <p className={cn("text-[13px]", isAdded ? "text-white/60" : "text-gray-400")}>
                  {diner.items} items ordered
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[15px] font-semibold tabular-nums tracking-tight">
                ₦{diner.total.toLocaleString("en-NG")}
              </p>
              <button
                onClick={() => toggleDiner(diner)}
                className={cn(
                  "mt-1 text-[13px] font-semibold underline-offset-4 hover:underline transition-all",
                  isAdded ? "text-emerald-400" : "text-blue-600"
                )}
              >
                {isAdded ? "Added to bill" : "Add to bill"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* SECTION: STICKY FOOTER / ACTION AREA */}
  <div className="space-y-4 rounded-[2.5rem] bg-gray-50 p-8">
    <button
      className="flex h-16 w-full items-center justify-center rounded-[1.5rem] bg-black text-[15px] font-semibold tracking-tight text-white shadow-xl shadow-black/10 transition-all hover:bg-gray-800 active:scale-95"
    >
      Proceed to Payment • ₦{totalToPay.toLocaleString("en-NG")}
    </button>
    
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
       <p className="text-[13px] text-center sm:text-left text-gray-400 leading-tight max-w-[200px]">
        {billingText}
      </p>
      <button className="text-[14px] font-semibold text-gray-900 underline underline-offset-8 transition-opacity hover:opacity-60">
        Cover everyone’s bill
      </button>
    </div>
  </div>
</div>
  );
};

export default BillSettlement;
