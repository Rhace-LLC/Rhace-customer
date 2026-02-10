"use client";

import { leaveGroup } from "@/api-services/dininggroup.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useSetupContext } from "@/contexts/SetupContext";
import { AlertTriangle, Trash2, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LeaveGroupConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasActiveOrders?: boolean;
}

export function LeaveGroupConfirmation({
  open,
  onOpenChange,
}: LeaveGroupConfirmationProps) {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { selectedRestaurant } = useSetupContext();
  const tableId = selectedRestaurant?.tableId;
  const restaurantId = selectedRestaurant?.restaurantId;
  const restaurantName = selectedRestaurant?.restaurantName;
  const tableNo = selectedRestaurant?.tableNo;

  const reloadLink = `${window.location}?tid=${tableId}&rid=${restaurantId}&r=${restaurantName}&tno=${tableNo}`;

  const onConfirm = async () => {
    setIsLoading(true);

    try {
      // 1. Execute the API call
      await leaveGroup(auth.token);

      // 2. Success Feedback
      toast.success("Successfully left the group", {
        description: "Your session has been ended.",
      });

      // 3. Close the dialog
      onOpenChange(false);

      // 4. Redirect instead of reload
      setTimeout(() => {
        window.location.href = reloadLink;
      }, 1000);
    } catch (error: any) {
      // 5. Error Feedback
      toast.error("Failed to leave group", {
        description:
          error?.message || "Something went wrong. Please try again.",
      });
      console.error("Leave Group Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px] rounded-[32px] border-none p-8 shadow-2xl">
        <AlertDialogHeader className="space-y-4">
          {/* Warning Icon Hub */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-rose-100/50 blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-100 bg-rose-50 text-rose-600">
                <AlertTriangle size={36} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-gray-900">
              Leave Group?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] leading-relaxed font-medium text-gray-500">
              Please review the consequences below:
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Warning List */}
        <div className="my-6 space-y-3">
          <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
              <Trash2 size={12} strokeWidth={3} />
            </div>
            <p className="text-sm leading-tight font-semibold text-gray-700">
              All items in your current group order will be{" "}
              <span className="text-rose-600">permanently deleted</span>.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white">
              <LogOut size={12} strokeWidth={3} />
            </div>
            <p className="text-sm leading-tight font-semibold text-gray-600">
              You will lose access to the shared table and real-time updates.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex-col gap-3 sm:flex-col">
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Prevent default shadcn close behavior to handle async
              onConfirm();
            }}
            disabled={isLoading}
            className="h-14 w-full rounded-2xl bg-rose-600 text-[13px] font-black tracking-widest text-white uppercase shadow-xl shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Confirm & Leave"
            )}
          </AlertDialogAction>

          <AlertDialogCancel className="h-14 w-full rounded-2xl border-none bg-gray-100 text-[13px] font-semibold tracking-widest text-gray-500 uppercase transition-all hover:bg-gray-200 hover:text-gray-700 active:scale-[0.98]">
            Stay in Group
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
