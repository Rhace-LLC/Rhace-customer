import { X, Download, Mail, CreditCard, Calendar, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface TransactionDetailSheetProps {
  transaction: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailSheet({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailSheetProps) {
  if (!transaction) return null;

  const handleDownloadReceipt = () => {
    // Mock download functionality
    alert("Receipt downloaded!");
  };

  const handleEmailReceipt = () => {
    // Mock email functionality
    alert("Receipt sent to your email!");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Receipt Details</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Restaurant Header */}
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <h3 className="mb-1 text-lg font-medium">Bookies Restaurant</h3>
            <p className="text-muted-foreground text-sm">
              123 Gourmet Street, Food District
            </p>
            <p className="text-muted-foreground text-sm">
              Phone: (555) 123-4567
            </p>
          </div>

          {/* Transaction Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Transaction ID
              </span>
              <span className="font-mono text-sm">{transaction.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Order ID</span>
              <span className="font-mono text-sm">{transaction.orderId}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">Date:</span>
              <span className="text-sm">{transaction.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">Time:</span>
              <span className="text-sm">{transaction.time}</span>
            </div>

            <div className="flex items-center gap-2">
              <CreditCard className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">
                Payment Method:
              </span>
              <span className="text-sm">{transaction.method}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Status</span>
              <Badge className="bg-green-100 text-green-800">
                {transaction.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h4 className="mb-3 font-medium">Order Items</h4>
            <div className="space-y-2">
              {transaction.items.map((item: string, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item}</span>
                  <span className="text-sm font-medium">
                    $
                    {(transaction.amount / transaction.items.length).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>${(transaction.amount * 0.9).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Tax</span>
              <span>${(transaction.amount * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Service Fee</span>
              <span>${(transaction.amount * 0.02).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>${transaction.amount}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={handleEmailReceipt}
              className="flex-1"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>

          <div className="text-muted-foreground pt-4 text-center text-xs">
            Thank you for dining with us!
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
