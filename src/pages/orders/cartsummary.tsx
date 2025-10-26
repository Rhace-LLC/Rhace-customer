import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import {
  createOrder,
  CreateOrderPayload,
  OrderItem,
} from "@/api-services/order.service";
import { useAuth } from "@/contexts/AuthContext";
import { getMe } from "@/api-services/auth.service";
import { useLoading } from "@/contexts/LoadingContext";
import { parseError } from "@/api-services/utils/parseError";
import { toast } from "sonner";
import {
  initializePayment,
  verifyPayment as verifyPaymentAPI,
} from "@/api-services/payments.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";

const OrderSummary: React.FC = () => {
  const auth = useAuth();
  const { setLoading, setLoadingText } = useLoading();
  const [user, setUser] = useState<any>();
  const [paymentDetails, setPaymentDetails] = useState<any>();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const orderCart = useSelector((state: RootState) => state.orderCart);

  const cartItems = orderCart.data || [];

  // 🧮 Calculate total
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.dishData.price || "0");
    return sum + price * item.quantity;
  }, 0);

  const handlePaymentDialogClose = async () => {
    setIsPaymentDialogOpen(false);

    if (!paymentDetails?.reference) return;

    const result = await verifyPayment(paymentDetails.reference, auth.token);

    if (result?.status === "success" || result?.status === "paid") {
      toast.success("✅ Payment completed successfully!");
    } else {
      toast.info("Payment not complete. Please try again.");
    }
  };
  // ✅ Get User Data
  const getUserData = async () => {
    try {
      setLoading(true);
      setLoadingText("Getting User Data");

      const res = await getMe(auth.token);

      toast.success("User data loaded successfully!");
      console.log("✅ User Data:", res);
      setUser(res)

      return res;
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to fetch user data");
      console.error("❌ Error getting user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Checkout
  const handleCheckout = async () => {
    await getUserData();
    try {
      setLoading(true);
      setLoadingText("Processing Checkout");

      const payload: CreateOrderPayload = {
        customer_id: user?.user_id, // adjust as needed
        order_type: "dine-in", // or "takeaway", etc.
        table_id: "a463b0de-b2fb-4f6a-b9f0-6ff4dc86ff47",
        items: orderCart.data.map((cartItem) => {
          return {
            menu_item_id: cartItem.dishData.id,
            quantity: cartItem.quantity,
          } as OrderItem;
        }),
        status: "received",
        customer_name: user?.name || "Guest",
        customer_phone: user?.phone || "",
        address: "123 Main St", // optional
      };

      const response = await createOrder(payload, auth.token);

      toast.success("Order created successfully!");
      console.log("✅ Order Response:", response);

      // initialize payment
      const payment = await initiaiteOrderPayment(String(response.id));
      setPaymentDetails(payment?.data);
      console.log("✅ Payment Response:", response);

      if (payment?.data?.authorization_url) {
        setIsPaymentDialogOpen(true);
      }

      return response;
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to create order");
      console.error("❌ Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initiate Order Payment
  const initiaiteOrderPayment = async (orderId: string) => {
    try {
      setLoading(true);
      setLoadingText("Initializing Payment...");

      const payload = {
        order_id: orderId,
        callback_url: "", // optional: dynamic callback
      };

      const response = await initializePayment(payload, auth.token);

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
  const verifyPayment = async (reference: string, token: string) => {
    try {
      setLoading(true);
      setLoadingText("Verifying Payment...");

      const response = await verifyPaymentAPI(reference, token); // from payments.service.ts

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
    <div className="mt-10 bg-gray-50">
      {/* Header */}
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Order Summary
      </h2>

      {/* Empty State */}

      <div className="my-6 border-t border-gray-200"></div>
      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.dishData.id} className="flex items-center gap-4">
            <img
              src={item.dishData.image_url || "/placeholder-dish.jpg"}
              alt={item.dishData.name}
              className="h-8 w-8 rounded-xl border border-gray-200 object-contain"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {item.dishData.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                ₦{parseFloat(item.dishData.price).toLocaleString()} ×{" "}
                {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-gray-800">
              ₦
              {(
                parseFloat(item.dishData.price) * item.quantity
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200"></div>

      {/* Total Summary */}
      <div className="mb-6 flex items-center justify-between">
        <span className="font-medium text-gray-600">Total</span>
        <span className="text-lg font-semibold text-gray-900">
          ₦{totalPrice.toLocaleString()}
        </span>
      </div>

      <Button
        onClick={() => {
          handleCheckout();
        }}
        className="rounded-11px] mt-4 flex h-11 w-full items-center justify-center gap-2 bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-600 active:scale-95 active:bg-blue-700"
      >
        Checkout
        <ArrowRight className="h-4 w-4" />
      </Button>
      {/* Payment Dialog */}
      {/* ✅ Payment Dialog using shadcn */}
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
};

export default OrderSummary;
