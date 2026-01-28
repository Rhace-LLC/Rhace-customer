import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BillSettlementOption = "individual" | "split";

interface GetBillConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceed: (option: BillSettlementOption) => void;
}

export const GetBillConfirmation = ({
  open,
  onOpenChange,
  onProceed,
}: GetBillConfirmationProps) => {
  const [selectedOption, setSelectedOption] =
    useState<BillSettlementOption>("individual");

  const handleProceed = () => {
    onProceed(selectedOption);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[90vw] overflow-hidden rounded-[2.5rem] border-none p-0 shadow-2xl sm:max-w-[480px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="bg-white p-8 sm:p-10">
          <DialogHeader className="mb-10 space-y-3 text-left">
            <p className="text-[14px] font-semibold tracking-[0.2em] text-blue-500 uppercase">
              Payment Structure
            </p>
            <DialogTitle className="text-2xl leading-tight font-semibold tracking-tighter text-gray-900">
              How should this group <br /> settle the bill?
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-600">
              Make sure everyone at the table has submitted their order. If you
              proceed now,{" "}
              <span className="font-medium text-gray-900">
                no one will be able to submit or update their order
              </span>{" "}
              afterwards.
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {/* OPTION: INDIVIDUAL */}
            <div
              onClick={() => setSelectedOption("individual")}
              className={cn(
                "group relative flex cursor-pointer flex-col gap-2 rounded-[2rem] border p-6 transition-all duration-300 active:scale-[0.98]",
                selectedOption === "individual"
                  ? "border-black bg-black text-white shadow-xl shadow-black/10"
                  : "border-gray-100 bg-white hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-semibold tracking-tight">
                  Individual Payment
                </h4>
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                    selectedOption === "individual"
                      ? "border-white"
                      : "border-gray-200"
                  )}
                >
                  {selectedOption === "individual" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <p
                className={cn(
                  "text-[14px] leading-relaxed",
                  selectedOption === "individual"
                    ? "text-white/60"
                    : "text-gray-400"
                )}
              >
                Everyone in the group pays only for the items they specifically
                ordered.
              </p>
            </div>

            {/* OPTION: CUSTOM */}
            <div
              onClick={() => setSelectedOption("split")}
              className={cn(
                "group relative flex cursor-pointer flex-col gap-2 rounded-[2rem] border p-6 transition-all duration-300 active:scale-[0.98]",
                selectedOption === "split"
                  ? "border-black bg-black text-white shadow-xl shadow-black/10"
                  : "border-gray-100 bg-white hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-semibold tracking-tight">
                  Custom Splitting
                </h4>
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                    selectedOption === "split"
                      ? "border-white"
                      : "border-gray-200"
                  )}
                >
                  {selectedOption === "split" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <p
                className={cn(
                  "text-[14px] leading-relaxed",
                  selectedOption === "split" ? "text-white/60" : "text-gray-400"
                )}
              >
                As the admin, you can assign specific amounts or percentages for
                each person.
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-10 flex flex-col gap-3">
            <Button
              onClick={handleProceed}
              disabled={!selectedOption}
              className="h-16 w-full rounded-2xl bg-black text-[15px] font-semibold tracking-tight text-white transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-20"
            >
              Proceed
            </Button>
            <button
              onClick={() => onOpenChange(false)}
              className="h-12 w-full text-[14px] font-semibold text-gray-400 transition-colors hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
