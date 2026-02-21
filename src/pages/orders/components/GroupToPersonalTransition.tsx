"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReceiptText, Info, ArrowRight } from "lucide-react";

interface TransitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  leaving: boolean;
}

const GroupToPersonalTransition: React.FC<TransitionDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  leaving,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-md overflow-hidden rounded-[28px] border-none bg-white p-0 shadow-2xl">
        {/* Visual Header - Ethereal Light Blue Direction */}
        <div className="relative overflow-hidden bg-blue-50/50 p-8 pt-10">
          {/* Soft Gradient Orb */}
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />

          {/* Delicate Icon Watermark */}
          <div className="absolute top-6 right-8 -rotate-12 text-blue-600/5">
            <ReceiptText size={100} strokeWidth={1} />
          </div>

          <div className="relative z-10 space-y-5">
            {/* Minimalist Icon Container */}
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-blue-100/50 bg-white shadow-sm transition-transform duration-500 hover:scale-105">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-200">
                <ArrowRight size={20} strokeWidth={3} />
              </div>
            </div>

            <DialogHeader className="space-y-1">
              <div className="mb-1 flex items-center justify-center gap-2">
                <span className="h-1 w-6 rounded-full bg-blue-600/20" />
                <span className="text-[10px] font-bold tracking-[0.25em] text-blue-600/60 uppercase">
                  Session Update
                </span>
              </div>
              <DialogTitle className="text-[24px] font-semibold tracking-tight text-slate-900">
                Switch to Personal Dining?
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Bottom Border Accent */}
          <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-blue-100 to-transparent" />
        </div>

        {/* Content Body */}
        <div className="space-y-6 p-8">
          <div className="space-y-4">
            <div className="align-center flex flex-col items-center justify-center gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <Info className="shrink-0 text-amber-600" size={20} />
              <p className="text-[14px] leading-relaxed font-medium text-amber-900">
                You order cannot be submitted at the moment for this reason:{" "}
                <br />
                The group bill for <span className="font-bold">
                  Table 12
                </span>{" "}
                has already been generated. To keep things organized, no further
                items can be added to the shared total.
              </p>
            </div>

            <DialogDescription className="text-[15px] leading-relaxed font-medium text-slate-500">
              Don't worry, you can keep ordering! We’ll simply move you to a
              <span className="font-bold text-slate-900"> Personal Tab</span>.
              This allows you to add new items and checkout independently
              without affecting the existing group bill.
            </DialogDescription>
          </div>

          {/* Interactive Path */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={onConfirm}
              disabled={leaving}
              className="h-14 w-full cursor-pointer rounded-2xl bg-slate-900 text-[15px] font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {leaving ? "Leaving..." : "Continue to My Personal Tab"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupToPersonalTransition;
