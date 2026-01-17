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
import { useEffect, useState } from "react";
import { getMyCurrentBill } from "@/api-services/billsettlement.service";
import { useAuth } from "@/contexts/AuthContext";

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

  const fetchMyBill = async () => {
    return await getMyCurrentBill(auth.token);
  };

  useEffect(() => {
    fetchMyBill();
  }, []);

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
      {/* Intro */}
      <p className="text-foreground/60 text-sm">
        Review your order and choose how you’d like to settle the bill.
      </p>

      {/* Your Order Card */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        {/* Card Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-white">
            <DollarSign className="h-4 w-4" />
          </div>
          <h3 className="text-foreground text-sm font-semibold">Your Order</h3>
        </div>

        {/* Items */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Jollof Rice</span>
            <span className="text-foreground/70">₦3,000 × 2</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Grilled Chicken</span>
            <span className="text-foreground/70">₦4,500 × 1</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-gray-100" />

        {/* Charges */}
        <div className="text-foreground/70 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₦10,500</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₦0</span>
          </div>
          <div className="flex justify-between">
            <span>Service charge</span>
            <span>₦0</span>
          </div>
        </div>

        {/* Footer Total */}
        <div className="text-foreground mt-4 flex justify-between text-sm font-semibold">
          <span>Total</span>
          <span>₦10,500</span>
        </div>
      </div>

      {/* Pay for my bill */}
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
            <h5 className="text-foreground text-sm font-semibold">
              Other diners
            </h5>
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
                    isAdded ? "text-green-600" : "text-primary hover:underline"
                  }`}
                >
                  {isAdded ? "Added to my bill" : "Add to my bill"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cover Everyone */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-foreground mb-3 text-sm">
          Feeling generous? You can settle the bill for everyone at once.
        </p>
        <button className="border-primary text-primary hover:bg-primary w-full rounded-lg border px-4 py-2 text-sm font-medium transition hover:text-white">
          I’d like to cover everyone’s bill
        </button>
      </div>

      <div className="py-6" />

      {/* Confirm Payment Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="w-[90%] max-w-[400px] rounded-md">
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

          <DialogFooter className="flex flex-col gap-2">
            <Button>Confirm payment</Button>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillSettlement;
