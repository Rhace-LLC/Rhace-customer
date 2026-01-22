import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle, RotateCcw, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGroupOrder } from "@/hooks/useDineGroupOrder";
import { useGroupBill } from "../hook/useGroupBill";
import { cn } from "@/lib/utils";

export interface DiningGroupCustomer {
  id: string;
  first_name: string;
  last_name: string;
}

interface BillSplitterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BillSubmission) => void;
}

export interface DiningGroupCustomer {
  id: string;
  first_name: string;
  last_name: string;
}

export interface BillSubmission {
  split_amounts: Allocation[];
}

interface Allocation {
  customer_id: string;
  amount_to_pay: number;
}

export const BillSplitterModal: React.FC<BillSplitterModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const { groupOrder } = useGroupOrder();
  const customers = groupOrder?.customers || [];
  const { groupBill, fetchGroupBill, groupBillError, groupBillLoading } =
    useGroupBill();

  let totalAmount = Number(groupBill?.total_amount);
  if (Number.isNaN(totalAmount)) {
    totalAmount = 0;
  }

  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [error, setError] = useState<string | null>(null);

  // LOGIC PRESERVED: initialize allocations
  useEffect(() => {
    if (open) {
      const initial = customers.map((c) => ({
        customer_id: c.id,
        amount_to_pay: 0,
      }));
      if (initial.length > 0)
        initial[initial.length - 1].amount_to_pay = totalAmount;
      setAllocations(initial);
      setError(null);
    }
  }, [open, customers, totalAmount]);

  // LOGIC PRESERVED: handle change
  const handleChange = (customer_id: string, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return;

    setAllocations((prev) => {
      const updated = prev.map((a) =>
        a.customer_id === customer_id ? { ...a, amount_to_pay: num } : a
      );
      const lastIndex = updated.length - 1;
      if (lastIndex >= 0) {
        const sumExcludingLast = updated
          .slice(0, lastIndex)
          .reduce((acc, a) => acc + a.amount_to_pay, 0);
        updated[lastIndex].amount_to_pay = Math.max(
          totalAmount - sumExcludingLast,
          0
        );
      }
      return updated;
    });
  };

  // LOGIC PRESERVED: submit
  const handleSubmit = () => {
    const sum = allocations.reduce((acc, a) => acc + a.amount_to_pay, 0);
    if (Math.round(sum * 100) / 100 !== Math.round(totalAmount * 100) / 100) {
      setError(
        `Total allocated amount must equal ${totalAmount.toFixed(2)}. Current sum: ${sum.toFixed(
          2
        )}`
      );
      return;
    }
    const payload: BillSubmission = { split_amounts: allocations };
    setError(null);
    onSubmit(payload);
    onOpenChange(false);
  };
  useEffect(() => {
    fetchGroupBill();
  }, [fetchGroupBill]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] overflow-hidden rounded-[2.5rem] border-none p-0 shadow-2xl sm:max-w-[480px]">
        {groupBillLoading && (
          <div className="animate-in fade-in flex flex-col items-center justify-center space-y-6 py-24 duration-500">
            {/* 1. LOADING STATE */}
            <DialogHeader className="mb-8 space-y-3 text-left">
              <p className="text-[14px] font-semibold tracking-[0.2em] text-blue-500 uppercase"></p>
              <DialogTitle className="text-2xl leading-tight font-semibold tracking-tighter text-gray-900"></DialogTitle>
            </DialogHeader>
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-gray-100" />
              <Loader2
                className="h-8 w-8 animate-spin text-gray-900"
                strokeWidth={1.5}
              />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-[14px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                Billing
              </p>
              <p className="text-[16px] font-medium text-gray-900">
                Calculating your table's bill...
              </p>
            </div>
          </div>
        )}

        {/* 2. ERROR STATE */}
        {groupBillError && !groupBillLoading && (
          <div className="animate-in zoom-in-95 mx-auto max-w-sm rounded-[2.5rem] border border-red-100 bg-red-50/30 p-10 text-center duration-300">
            {/* 1. LOADING STATE */}
            <DialogHeader className="mb-8 space-y-3 text-left">
              <p className="text-[14px] font-semibold tracking-[0.2em] text-blue-500 uppercase"></p>
              <DialogTitle className="text-2xl leading-tight font-semibold tracking-tighter text-gray-900"></DialogTitle>
            </DialogHeader>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <AlertCircle
                className="text-red-500"
                size={28}
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-[18px] font-semibold tracking-tight text-gray-900">
              Connection Issue
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
              {groupBillError ||
                "We couldn't retrieve the bill from the kitchen."}
            </p>
            <Button
              onClick={fetchGroupBill}
              className="mt-8 h-14 w-full rounded-2xl bg-gray-900 text-[14px] font-semibold tracking-[0.15em] text-white uppercase transition-all hover:bg-black active:scale-95"
            >
              <RotateCcw size={16} className="mr-2" />
              Retry Connection
            </Button>
          </div>
        )}

        {/* 3. SUCCESS / CONTENT STATE */}
        {!groupBillLoading && !groupBillError && groupBill && (
          <>
            <div className="bg-white p-8 sm:p-10">
              {/* 1. LOADING STATE */}
              <DialogHeader className="mb-8 space-y-3 text-left">
                <p className="text-[14px] font-semibold tracking-[0.2em] text-blue-500 uppercase">
                  Bill Allocation
                </p>
                <DialogTitle className="text-md w-full leading-tight font-semibold tracking-tighter text-gray-900">
                  Assign payment <br /> for each member
                </DialogTitle>
              </DialogHeader>
              {/* MAIN CONTENT */}
              {!groupBillLoading && !groupBillError && (
                <div className="space-y-8">
                  {/* SUMMARY BOX */}
                  <div className="flex items-center justify-between rounded-[2rem] border border-gray-100/50 bg-gray-50 p-6">
                    <div className="space-y-1">
                      <p className="text-[13px] font-semibold tracking-wider text-gray-400 uppercase">
                        Total Bill
                      </p>
                      <p className="text-xl font-bold tracking-tight text-gray-900">
                        ₦
                        {totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <Wallet size={20} className="text-gray-900" />
                    </div>
                  </div>

                  {/* ALLOCATION LIST */}
                  <div className="custom-scrollbar max-h-[35vh] space-y-4 overflow-y-auto pr-2">
                    {customers.map((customer, index) => {
                      const alloc = allocations.find(
                        (a) => a.customer_id === customer.id
                      );
                      const isLast = index === customers.length - 1;

                      return (
                        <div
                          key={customer.id}
                          className="flex items-center justify-between gap-4 py-1"
                        >
                          <div className="space-y-1">
                            <Label className="text-[15px] font-semibold text-gray-900">
                              {customer.first_name} {customer.last_name}
                            </Label>
                            {isLast && customers.length > 1 && (
                              <p className="text-[13px] font-medium text-blue-500 italic">
                                Auto-calculating
                              </p>
                            )}
                          </div>

                          <div className="relative">
                            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[14px] font-medium text-gray-400">
                              ₦
                            </span>
                            <Input
                              type="number"
                              className={cn(
                                "h-12 w-36 rounded-xl border-gray-100 bg-gray-50 pl-7 text-[15px] font-semibold transition-all focus:ring-black",
                                isLast &&
                                  customers.length > 1 &&
                                  "cursor-not-allowed border-transparent bg-gray-100/50 text-gray-500"
                              )}
                              value={String(alloc?.amount_to_pay) || 0}
                              onChange={(e) =>
                                handleChange(customer.id, e.target.value)
                              }
                              disabled={isLast && customers.length > 1}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* FOOTER ACTIONS */}
                  <div className="space-y-4 pt-4">
                    {error && (
                      <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-red-600">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <p className="text-[14px] leading-tight font-medium">
                          {error}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handleSubmit}
                      disabled={allocations.length === 0}
                      className="h-16 w-full rounded-2xl bg-black text-[15px] font-semibold tracking-tight text-white shadow-xl shadow-black/10 transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-30"
                    >
                      Confirm Splitting
                    </Button>

                    <button
                      onClick={() => onOpenChange(false)}
                      className="w-full py-2 text-[14px] font-semibold text-gray-400 transition-colors hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
