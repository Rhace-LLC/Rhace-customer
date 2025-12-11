import {
  Clock,
  CheckCircle,
  Utensils,
  XCircle,
  Badge,
  CreditCard,
  BadgeHelp,
  ShieldCheck,
} from "lucide-react";
import moment from "moment";
import { Order } from "@/api-services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/contexts/LoadingContext";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { parseError } from "@/api-services/utils/parseError";
import {
  initializePayment,
  verifyPayment,
} from "@/api-services/payments.service";
const getStatusColor = (status: string) => {
  switch (status) {
    case "received":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    case "ready":
      return "bg-purple-100 text-purple-800";
    case "served":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "received":
    case "preparing":
      return <Utensils className="h-5 w-5 animate-pulse text-gray-400" />;
    case "ready":
    case "served":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-400" />;
  }
};

interface OrdersOverviewProps {
  userOrders: Order[];
  onOrderClick?: (order: Order) => void;
}

export function OrdersOverview({
  userOrders,
  onOrderClick,
}: OrdersOverviewProps) {
  const auth = useAuth();

  const { setLoading, setLoadingText } = useLoading();
  const [paymentDetails, setPaymentDetails] = useState<any>();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const handlePaymentDialogClose = async () => {
    setIsPaymentDialogOpen(false);

    if (!paymentDetails?.reference) return;

    const result = await verifyPaymentStatus(
      paymentDetails.reference,
      auth.token
    );

    if (result?.data?.payment_status === "paid") {
      toast.success("Payment completed successfully!");
    } else {
      toast.info("Payment not complete. Please try again.");
    }
  };

  // ✅ Initiate Order Payment
  const initiaiteOrderPayment = async (orderId: string): Promise<any> => {
    try {
      setLoading(true);
      setLoadingText("Initializing Payment...");

      const payload = {
        order_id: orderId,
        callback_url: "", // optional: dynamic callback
      };

      const response = await initializePayment(payload, auth.token);
      setPaymentDetails(response);

      toast.success("Payment initialized successfully!");
      console.log("✅ Payment Initialization Response:", response);

      return response;
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to initialize payment");
      console.error("❌ Error initializing payment:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify Payment
  const verifyPaymentStatus = async (reference: string, token: string) => {
    try {
      setLoading(true);
      setLoadingText("Verifying Payment...");

      const response = await verifyPayment(reference, token); // from payments.service.ts

      toast.success("Payment verification completed!");
      console.log("✅ Payment Verification Response:", response);

      return response;
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to verify payment");
      console.error("❌ Error verifying payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {userOrders.map((order) => (
        <Card
          key={order.id}
          className="cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-lg"
          onClick={() => onOrderClick?.(order)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold md:text-base">
                Order #{order.id}
              </CardTitle>

              {/* Order Status Badge */}
              <Badge
                className={`rounded-full px-2 py-1 text-xs md:text-sm ${getStatusColor(order.status)}`}
              >
                {order.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-1">
            <div className="flex items-start gap-3">
              <span className="text-xs text-gray-700 capitalize">
                {getStatusIcon(order.status)} {order.status}
              </span>

              <div className="flex-1">
                <p className="mb-1 line-clamp-2 text-sm text-gray-500">
                  {order.items.map((item) => item.menu_item_name).join(", ")}
                </p>

                <div className="mt-1 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {moment(order.created_at).format("lll")}
                  </span>

                  <span className="text-sm font-semibold">
                    NGN{" "}
                    {Number(order.total_price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
            {/* Payment Actions */}
            <div className="mt-3 items-center gap-3 hidden">
              {/* Payment Pending → Show Pay Button */}
              {order.payment === "pending" && (
                <div className="w-full space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 font-semibold text-amber-700">
                    <BadgeHelp className="h-5 w-5" />
                    <span>Payment Pending</span>
                  </div>

                  <p className="text-sm text-amber-800">
                    Your payment is currently marked as pending. Click "Retry
                    Verification" to check if the payment went through. If it
                    still hasn't been verified, you may need to re-initiate the
                    payment.
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="mt-2 w-full rounded-md border border-amber-300 bg-amber-100 px-4 py-2 font-medium text-amber-700 transition hover:bg-amber-200"
                  >
                    Retry Verification
                  </button>
                </div>
              )}

              {order.payment && (
                <Button
                  variant="outline"
                  className="border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    // call payment function
                    initiaiteOrderPayment(String(order.id));
                  }}
                >
                  <CreditCard className="mr-1 h-4 w-4" />
                  Pay
                </Button>
              )}

              {/* Confirmed → Payment Verified Badge */}
              {order.payment === "confirmed" && (
                <Badge className="flex items-center gap-1 bg-green-100 text-green-700">
                  <ShieldCheck className="h-4 w-4" />
                  Payment Verified
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog
        open={isPaymentDialogOpen}
        onOpenChange={(open) => {
          if (!open) handlePaymentDialogClose(); // When user closes the dialog
        }}
      >
        <DialogContent className="h-[500px] w-[80%] max-w-lg overflow-hidden rounded-2xl p-0">
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
            <div className="space-y-2 py-2 text-center">
              <DialogTitle>
                Complete Payment{" "}
                <CheckCircle className="inline h-4 w-5 text-green-500" />
              </DialogTitle>
              <DialogDescription>
                Follow the steps below to complete your payment.
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Payment iframe */}
          <iframe
            src={paymentDetails?.authorization_url}
            title="Payment"
            className="h-[600px] w-full border-0"
          ></iframe>
        </DialogContent>
      </Dialog>
    </div>
  );
}
