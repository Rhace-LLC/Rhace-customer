import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGroupOrder } from "@/hooks/useDineGroupOrder";
import { useGroupBill } from "../hook/useGroupBill";

interface BillSplitterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (allocations: { customerId: string; amount: number }[]) => void;
}

interface Allocation {
  customerId: string;
  amount: number;
}

export const BillSplitterModal: React.FC<BillSplitterModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const { groupOrder } = useGroupOrder();
  const customers = groupOrder?.customers;
  const { groupBill } = useGroupBill();
  let totalAmount = Number(groupBill?.total_amount);
  if (Number.isNaN(totalAmount)) {
    totalAmount = 0;
  }
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!customers) {
    return <>No customers to allocate to.</>;
  }

  // initialize allocations when modal opens
  useEffect(() => {
    if (open) {
      setAllocations(
        customers.map((c) => ({
          customerId: c.id,
          amount: 0,
        }))
      );
      setError(null);
    }
  }, [open, customers]);

  const handleChange = (customerId: string, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return; // don't allow negative or invalid
    setAllocations((prev) =>
      prev.map((a) => (a.customerId === customerId ? { ...a, amount: num } : a))
    );
  };

  const handleSubmit = () => {
    const sum = allocations.reduce((acc, a) => acc + a.amount, 0);
    if (sum !== totalAmount) {
      setError(
        `Total allocated amount must equal ${totalAmount.toFixed(2)}. Current sum: ${sum.toFixed(
          2
        )}`
      );
      return;
    }
    setError(null);
    onSubmit(allocations);
    onOpenChange(false);
  };

  const remainingAmount =
    totalAmount - allocations.reduce((acc, a) => acc + a.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Split Bill</DialogTitle>
          <DialogDescription>
            Allocate the total bill among your group. Remaining amount:{" "}
            <strong>{remainingAmount.toFixed(2)}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {customers.map((customer) => {
            const alloc = allocations.find((a) => a.customerId === customer.id);
            return (
              <div
                key={customer.id}
                className="flex items-center justify-between gap-2"
              >
                <Label className="flex-1">
                  {customer.first_name} {customer.last_name}
                </Label>
                <Input
                  type="number"
                  className="w-24"
                  value={alloc?.amount.toString() || "0"}
                  onChange={(e) => handleChange(customer.id, e.target.value)}
                  min={0}
                />
              </div>
            );
          })}
        </div>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        <DialogFooter className="mt-6">
          <Button onClick={handleSubmit} disabled={allocations.length === 0}>
            Submit Allocation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
