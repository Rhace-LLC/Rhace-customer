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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  refetchOrderById: (order_id: number) => void;
}

export function OrdersOverview({
  userOrders,
  onOrderClick,
  refetchOrderById,
}: OrdersOverviewProps) {
  const auth = useAuth();

  const { setLoading, setLoadingText } = useLoading();
  const [paymentDetails, setPaymentDetails] = useState<any>();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<any>("");

  const handlePaymentDialogClose = async (
    reference: string | null,
    orderId: number,
    orderCloseEvent: boolean = false
  ) => {
    setIsPaymentDialogOpen(false);

    if (!reference) return;

    const result = await verifyPaymentStatus(reference);
    console.log("result", result);

    if (result?.data?.payment_status === "success") {
      toast.success("Payment completed successfully!");
    } else {
      toast.info(
        `Payment ${result?.data?.payment_status.toUpperCase()}. You need to reinitialize the payment. a modal would popup with a payment modal.`
      );
      if (!orderCloseEvent) {
        initiaiteOrderPayment(String(orderId));
      }
    }
  };

  // ✅ Initiate Order Payment
  const initiaiteOrderPayment = async (orderId: string): Promise<any> => {
    try {
      setLoading(true);
      setLoadingText("Initializing Payment...");

      const payload = {
        order_id: orderId,
        callback_url: "",
      };

      const response = await initializePayment(payload, auth.token);
      console.log("response", response);

      setPaymentDetails(response.data); // ✅ FIX
      setIsPaymentDialogOpen(true);

      toast.success("Payment initialized successfully!");
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  const verifyPaymentStatus = async (reference: string) => {
    try {
      setLoading(true);
      setLoadingText("Verifying Payment...");

      const response = await verifyPayment(reference, auth.token); // from payments.service.ts

      return response;
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to verify payment");
      console.error("❌ Error verifying payment:", error);
    } finally {
      setLoading(false);
      refetchOrderById(selectedOrderId);
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
            <div className="mt-3 items-center gap-3">
              {/* Payment Pending && No Reference - Payment has not been initiated, initialize flow from the start */}

              <div className="mt-3 w-full items-center gap-3">
                {order.payment === "pending" && !order.payment_reference && (
                  <div className="w-full space-y-2">
                    <div className="font-medium text-blue-700">
                      Payment was not initialized, please start again.
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        initiaiteOrderPayment(String(order.id));
                        setSelectedOrderId(order.id);
                      }}
                    >
                      <CreditCard className="mr-1 h-4 w-4" />
                      Pay
                    </Button>
                  </div>
                )}

                {order.payment === "failed" && (
                  <div className="w-full space-y-2">
                    <div className="font-medium text-blue-700">
                      Payment failed. Please try again.
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        initiaiteOrderPayment(String(order.id));
                        setSelectedOrderId(order.id);
                      }}
                    >
                      <CreditCard className="mr-1 h-4 w-4" />
                      Pay
                    </Button>
                  </div>
                )}

                {order.payment === "pending" && order.payment_reference && (
                  <div className="w-full space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-4 text-center">
                    <div className="flex items-center justify-center gap-2 font-semibold text-amber-700">
                      <BadgeHelp className="h-5 w-5" />
                      <span>Payment Pending</span>
                    </div>

                    <p className="text-sm text-amber-800">
                      Your payment is still pending. Click “Retry Verification”
                      to check if the payment went through. If it hasn’t, you
                      may need to re-initiate.
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrderId(order.id);
                        // run your verify logic here
                        handlePaymentDialogClose(
                          order?.payment_reference || "",
                          order.id
                        );
                      }}
                      className="mt-2 w-full rounded-md border border-amber-300 bg-amber-100 px-4 py-2 font-medium text-amber-700 transition hover:bg-amber-200"
                    >
                      Retry Verification
                    </button>
                  </div>
                )}

                {order.payment === "paid" && (
                  <div className="flex w-fit items-center gap-1 rounded bg-green-100 p-2 px-3 text-green-700">
                    <ShieldCheck className="h-4 w-4" />
                    Payment Verified
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog
        open={isPaymentDialogOpen}
        onOpenChange={(open) => {
          if (!open)
            handlePaymentDialogClose(
              paymentDetails.reference,
              selectedOrderId,
              true
            ); // Only allow closing via your handler
        }}
      >
        <DialogContent
          className="h-[500px] w-[80%] max-w-lg overflow-hidden rounded-2xl p-0"
          onInteractOutside={(e) => e.preventDefault()} // Prevents closing on outside click
        >
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
