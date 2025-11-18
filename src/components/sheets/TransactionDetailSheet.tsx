import {
  Download,
  Mail,
  CreditCard,
  Calendar,
  Clock,
  DollarSign,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

// --- START: Updated Payment Interface (for clarity) ---
export interface Payment {
  id: string;
  reference: string;
  order_id: number;
  amount: number; // Total amount
  currency: string;
  status: "processing" | "failed" | "success";
  payment_method: string | null;
  customer_email: string;
  created_at: string; // The original field to use for date/time
  paid_at: string | null;
  fees: number;
  order_type: "dine-in" | string;
  // NOTE: 'items' is missing from this interface, so I'll create mock data for it
}

interface TransactionDetailSheetProps {
  transaction: Payment;
  isOpen: boolean;
  onClose: () => void;
}

// Mock Item Data for the receipt display, as 'items' is missing from the Payment interface.
const MOCK_ORDER_ITEMS = [
  { name: "Wagyu Beef Burger", price: 18.0 },
  { name: "Truffle Fries", price: 9.5 },
  { name: "Iced Lemonade", price: 4.0 },
];

// Helper function to format date and time from the ISO string
const formatDateAndTime = (isoString: string) => {
  const date = new Date(isoString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date: formattedDate, time: formattedTime };
};

export function TransactionDetailSheet({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailSheetProps) {
  if (!transaction) return null;

  const { date, time } = formatDateAndTime(transaction.created_at);
  const currencySymbol =
    transaction.currency === "USD" ? "$" : transaction.currency;

  const subtotal = transaction.amount - transaction.fees;
  // NOTE: Assuming the 'fees' field in the API response represents the total fees (Tax + Service)
  // Since we don't have separate tax/service fields, I'll estimate them for the summary.
  const TAX_RATE = 0.08;
  const estimatedTax = subtotal * TAX_RATE;
  const estimatedServiceFee = transaction.fees - estimatedTax;

  // Function to set the badge style based on status
  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {status.toUpperCase()}
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {status.toUpperCase()}
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {status.toUpperCase()}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full pt-[60px] sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Transaction Receipt</SheetTitle>
            {getStatusBadge(transaction.status)}
          </div>
        </SheetHeader>

        <div className="max-h-[calc(100vh-100px)] space-y-6 overflow-y-auto pb-8">
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
              <span className="font-mono text-sm">{transaction.order_id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Reference</span>
              <span className="font-mono text-sm">{transaction.reference}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">Date:</span>
              <span className="text-sm font-medium">{date}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">Time:</span>
              <span className="text-sm font-medium">{time}</span>
            </div>

            <div className="flex items-center gap-2">
              <CreditCard className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">
                Payment Method:
              </span>
              <span className="text-sm font-medium">
                {transaction.payment_method || "N/A"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>
                {currencySymbol}
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>Service Fee</span>
              <span>
                {currencySymbol}
                {estimatedServiceFee.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Total Fees</span>
              <span>
                {currencySymbol}
                {transaction.fees.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between pt-1 text-lg font-medium">
              <span className="flex items-center">
                <DollarSign className="mr-1 h-5 w-5" />
                **TOTAL PAID**
              </span>
              <span>
                **{currencySymbol}
                {transaction.amount.toFixed(2)}**
              </span>
            </div>
          </div>

          <Separator />

          {/* Customer Email */}
          <div className="flex items-center gap-2">
            <Mail className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              Customer Email:
            </span>
            <span className="text-sm font-medium">
              {transaction.customer_email}
            </span>
          </div>

          {/* Actions
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
              onClick={handleEmailReceipt}
              className="flex-1"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Receipt
            </Button>
          </div> */}

          <div className="text-muted-foreground pt-4 text-center text-xs">
            Thank you for dining with us!
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
