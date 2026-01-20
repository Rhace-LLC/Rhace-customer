import { useState } from "react";
import { DollarSign, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [addedDiners, setAddedDiners] = useState<Diner[]>([]);
  const [showDialog, setShowDialog] = useState(false);

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

  return (
    <>
      <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
        {/* Intro */}
        <p className="text-foreground/60 text-sm">
          Review your order and choose how you’d like to settle the bill.
        </p>

        {/* Your Order */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-white">
              <DollarSign className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold">Your Order</h3>
          </div>

          <div className="flex justify-between text-sm font-medium">
            <span>Total</span>
            <span>₦{MY_TOTAL.toLocaleString("en-NG")}</span>
          </div>
        </div>

        {/* Pay CTA */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <button
            onClick={() => setShowDialog(true)}
            className="bg-primary hover:bg-primary/90 h-12 w-full rounded-lg text-sm font-medium text-white transition active:scale-95"
          >
            Pay for my bill
          </button>
          <p className="text-foreground/60 mt-2 text-center text-xs">
            {billingText}
          </p>
        </div>

        {/* Other Diners */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-semibold">Other diners</h5>
              <p className="text-foreground/60 text-xs">
                You can choose to cover another diner’s bill or keep payments
                separate.
              </p>
            </div>
            <Users className="text-foreground/40 h-5 w-5" />
          </div>

          {OTHER_DINERS.map((diner) => {
            const isAdded = addedDiners.some((d) => d.id === diner.id);

            return (
              <div
                key={diner.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white">
                    {diner.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{diner.name}</p>
                    <p className="text-foreground/60 text-xs">
                      {diner.items} items ordered
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium">
                    ₦{diner.total.toLocaleString("en-NG")}
                  </p>
                  <button
                    onClick={() => toggleDiner(diner)}
                    className={`mt-1 text-xs font-medium ${
                      isAdded
                        ? "text-green-600"
                        : "text-primary hover:underline"
                    }`}
                  >
                    {isAdded ? "Added to my bill" : "Add to my bill"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="py-6" />
      </div>

      {/* Confirm Payment Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm payment</DialogTitle>
            <DialogDescription>
              You’re about to pay for the following:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between font-medium">
              <span>Your order</span>
              <span>₦{MY_TOTAL.toLocaleString("en-NG")}</span>
            </div>

            {addedDiners.map((diner) => (
              <div
                key={diner.id}
                className="text-foreground/80 flex justify-between"
              >
                <span>{diner.name}</span>
                <span>₦{diner.total.toLocaleString("en-NG")}</span>
              </div>
            ))}

            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total to pay</span>
              <span>₦{totalToPay.toLocaleString("en-NG")}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button>Confirm payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BillSettlement;
