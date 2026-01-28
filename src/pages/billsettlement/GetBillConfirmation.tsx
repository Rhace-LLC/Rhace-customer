import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Receipt, Info } from "lucide-react";

interface ConfirmGetBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const ConfirmGetBillDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmGetBillDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] overflow-hidden rounded-[2.5rem] border-none p-0 shadow-2xl sm:max-w-[420px]">
        <div className="bg-white p-8 sm:p-10">
          {/* HEADER: TYPOGRAPHIC FOCUS */}
          <DialogHeader className="mb-8 items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-900 ring-1 ring-gray-100">
              <Receipt size={28} strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Finalize & Bill
            </DialogTitle>
            <DialogDescription className="mt-2 text-[15px] leading-relaxed font-medium text-gray-500">
              Confirming will generate the final bill and lock all current table
              orders.
            </DialogDescription>
          </DialogHeader>

          {/* WARNING CARD: SOFT UI */}
          <div className="mb-10 rounded-[1.5rem] bg-amber-50/50 p-5 ring-1 ring-amber-100/50">
            <div className="mb-1.5 flex items-center gap-2 text-amber-700">
              <Info size={14} strokeWidth={2.5} />
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase">
                Important Note
              </span>
            </div>
            <p className="text-[13px] leading-relaxed font-medium text-amber-900/80">
              Please ensure all guests have finished. Once proceeded,{" "}
              <span className="font-bold underline decoration-amber-200 underline-offset-2">
                no further modifications
              </span>{" "}
              can be made to this session.
            </p>
          </div>

          {/* ACTIONS: HIGH CONTRAST */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="h-14 w-full rounded-2xl bg-black text-[15px] font-bold tracking-tight text-white shadow-xl shadow-black/10 transition-all hover:bg-gray-800 active:scale-[0.98]"
            >
              Confirm & Get Bill
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-12 w-full rounded-xl text-[14px] font-bold text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              Go back
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
