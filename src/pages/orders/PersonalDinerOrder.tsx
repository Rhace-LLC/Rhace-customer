import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addItemsToOrder,
  cancelOrder,
  createOrder,
  CreateOrderPayload,
  OrderItem,
} from "@/api-services/order.service";

import { useAuth } from "@/contexts/AuthContext";
import { parseError } from "@/api-services/utils/parseError";
import { toast } from "sonner";
import { useLoading } from "@/contexts/LoadingContext";

import {
  initializePayment,
  verifyPayment as verifyPaymentAPI,
} from "@/api-services/payments.service";

import FullScreenError, {
  FullScreenLoader,
  NoCartItem,
  OrderSubmissionConfirmation,
  UnpaidOrderCard,
  UserCart,
} from "./components/utils";
import { formatNumberWithDecimals } from "@/utils/utils";
import { ArrowRight, CheckCircle, Info } from "lucide-react";
import { clearCart } from "@/store/orderCart.slice";
import { useUnpaidUncompleted } from "./hook/useUnpaidUncompleted";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

const PersonalDineOrder = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { setLoading, setLoadingText } = useLoading();

  const [paymentDetails, setPaymentDetails] = useState<any>();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const selectedRestaurant = useSelector(
    (state: RootState) => state.selectedRestaurant
  );

  const orderCart = useSelector((state: RootState) => state.orderCart);

  const cartItems = orderCart.data || [];

  // 🧮 Calculate total
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.dishData.price || "0");
    return sum + price * item.quantity;
  }, 0);

  const {
    unpaidOrders,
    uncompletedOrders,
    unpaidOrderError,
    activeOrderError,
    unpaidOrderLoading,
    activeOrderLoading,
    getUserUnpaidOrder,
    getUserActiveOrder,
  } = useUnpaidUncompleted();

  const handleSubmitOrder = async () => {
    if (!auth.isAuthenticated) {
      toast.info("You need to be logged in to checkout");
      navigate(`/login?next=orders`);
      return;
    }

    try {
      setLoading(true);
      setLoadingText("Submitting Order..");

      const payload: CreateOrderPayload = {
        customer_id: auth?.user?.id || "", // adjust as needed
        order_type: "dine-in", // or "takeaway", etc.
        table_id: selectedRestaurant.tableId,
        items: orderCart.data.map((cartItem) => {
          return {
            menu_item_id: cartItem.dishData.id,
            quantity: cartItem.quantity,
          } as OrderItem;
        }),
        status: "received",
        customer_name: `${auth?.user?.last_name} ${auth?.user?.first_name}`,
        customer_phone: "",
        address: "", // optional
      };

      await createOrder(payload, auth.token);
      toast.info(
        "Order Submitted Successfully, You may now proceed to settle bill"
      );
      dispatch(clearCart());
      getUserActiveOrder();
      getUserUnpaidOrder();
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    const addOrderPayload = orderCart.data.map((x) => {
      return { menu_item_id: x.dishData.id, quantity: x.quantity };
    });

    try {
      setLoading(true);
      setLoadingText("Updating Order");
      if (!unpaidOrders[0]) {
        toast.error("No pending order found to update.");
        return;
      }

      await addItemsToOrder(
        unpaidOrders[0]?.id,
        { items: addOrderPayload },
        auth.token
      );
      getUserActiveOrder();
      getUserUnpaidOrder();
      dispatch(clearCart());
    } catch (error) {
      const errorMessage = parseError(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelUserOrder = async (id: number) => {
    try {
      setLoading(true);
      setLoadingText("Cancelling Order");
      await cancelOrder(id, { status: "cancelled" }, auth.token);
    } catch (error) {
      const errorMessage = parseError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initiate Order Payment
  const initiaiteOrderPayment = async (): Promise<any> => {
    if (!auth.isAuthenticated) {
      toast.info("You need to be logged in to checkout");
      navigate(`/login?next=orders`);
      return;
    }

    const id = unpaidOrders[0].id;
    try {
      setLoading(true);
      setLoadingText("Initializing Payment...");

      const payload = {
        order_id: String(id),
      };

      const response = await initializePayment(payload, auth.token);
      setPaymentDetails(response?.data);

      if (response?.data?.authorization_url) {
        setIsPaymentDialogOpen(true);
      }

      toast.success("Payment initialized successfully!");

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
      return response;
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to verify payment");
      console.error("❌ Error verifying payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentDialogClose = async () => {
    setIsPaymentDialogOpen(false);

    if (!paymentDetails?.reference) return;

    const result = await verifyPayment(paymentDetails.reference, auth.token);
    getUserUnpaidOrder();
    getUserActiveOrder();
    if (result?.data?.payment_status === "success") {
      toast.success("Payment completed successfully!");
    } else {
      toast.info("Payment not complete. Please try again.");
    }
  };
  useEffect(() => {
    if (uncompletedOrders.length == 0 && unpaidOrders.length == 0) {
      getUserActiveOrder();
      getUserUnpaidOrder();
    }
  }, []);

  /*
  + heading --- Done
  + no order ui
  + existing order ui
  + pending order ui
  + cart
  + submit order
  + update order
  + pay for order
  + see order status
  + cancel order
  */

  if (activeOrderLoading || unpaidOrderLoading) {
    return <FullScreenLoader />;
  }

  if (activeOrderError) {
    return (
      <FullScreenError
        message={activeOrderError}
        onRetry={getUserActiveOrder}
      />
    );
  }

  if (unpaidOrderError) {
    return (
      <FullScreenError
        message={unpaidOrderError}
        onRetry={getUserUnpaidOrder}
      />
    );
  }

  return (
    <>
      <OrderSubmissionConfirmation
        open={showConfirmation}
        onOpenChange={(val: boolean) => {
          handleSubmitOrder();
          setShowConfirmation(val);
        }}
      />
      <button className="hidden" onClick={() => cancelUserOrder(3)}>
        Cancel Order
      </button>

      {uncompletedOrders.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 flex flex-col gap-5 rounded-[1.5rem] border border-blue-100/50 bg-blue-50/40 p-5 duration-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center gap-4">
            {/* Muted Icon Indicator */}
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm ring-1 ring-blue-100/50">
              <Info size={18} strokeWidth={2} />
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-500/80 uppercase">
                Order Status
              </p>

              <div className="space-y-2">
                {uncompletedOrders.map((order) => (
                  <p
                    key={order.id}
                    className="text-sm leading-relaxed font-medium tracking-tight text-blue-900/80"
                  >
                    Order{" "}
                    <span className="font-semibold text-blue-600">
                      #{order.id}
                    </span>{" "}
                    for{" "}
                    <span className="text-blue-900/60">
                      {order.items.map((i) => i.menu_item_name).join(", ")}
                    </span>{" "}
                    is currently{" "}
                    <span className="lowercase italic">{order.status}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <Link to={`/orders/active`} className="w-full sm:w-auto">
            <button className="h-11 w-full rounded-xl bg-white px-6 text-[11px] font-semibold tracking-widest text-blue-600 uppercase shadow-sm ring-1 ring-blue-100 transition-all hover:bg-blue-50 hover:text-blue-700 active:scale-95 sm:w-max">
              View Progress
            </button>
          </Link>
        </div>
      )}

      {(orderCart.data.length > 0 || unpaidOrders.length > 0) && (
        <>
          {/* Page Header */}
          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Personal Dining
            </h1>

            <p className="text-foreground/60 text-sm">
              A private dining experience, just for you.
            </p>
          </div>
        </>
      )}
      {unpaidOrders.length > 0 && (
        <>
          {/* Here we show you your order and prompt you to pay, you would also see your cart and if there is any stuff in your cart, you can update the order */}
          <UnpaidOrderCard data={unpaidOrders} />
        </>
      )}

      {unpaidOrders.length == 0 && (
        <>
          <UserCart />
          {/* there isnt any unpaid orders and no uncoompleted order, so show the cart and the functionality would be to to submit order*/}
        </>
      )}

      {orderCart.data.length == 0 &&
        unpaidOrders.length == 0 &&
        uncompletedOrders.length == 0 && <NoCartItem />}

      {/* Create Order Functional Section */}
      {unpaidOrders.length == 0 && orderCart.data.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 mt-6 duration-500">
          {/* Divider */}
          <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* SUBMIT CART ORDER */}
              <>
                <div className="space-y-1 text-center">
                  <p className="text-[16px] font-medium tracking-[0.2em] text-gray-400 uppercase">
                    Your Cart Order Totals To:
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-bold text-gray-900">₦</span>
                    <span className="text-3xl font-medium tracking-tighter text-gray-900">
                      {formatNumberWithDecimals(totalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowConfirmation(true);
                  }}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black px-8 text-[16px] font-semibold tracking-[0.2em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-gray-900 active:scale-95"
                >
                  Submit Order
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </>
            </div>
          </div>
        </div>
      )}

      {unpaidOrders.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 mt-6 duration-500">
          {/* Divider */}
          <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* SUBMIT CART ORDER */}
              <>
                {orderCart.data.length > 0 ? (
                  <>
                    <div className="space-y-1 text-center">
                      <div className="space-y-1">
                        <p className="text-[16px] font-medium tracking-[0.2em] text-gray-400 uppercase">
                          You added other items
                        </p>
                        <p className="text-sm text-gray-500">
                          Submit the update so we can process it and generate
                          your bill.
                        </p>
                      </div>

                      <button
                        onClick={handleUpdateOrder}
                        className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black px-8 text-[16px] font-semibold tracking-[0.2em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-gray-900 active:scale-95"
                      >
                        Update Order
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1 text-center">
                      <button
                        onClick={initiaiteOrderPayment}
                        className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black px-8 text-[16px] font-semibold tracking-[0.2em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-gray-900 active:scale-95"
                      >
                        Settle Bill
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </button>
                    </div>
                  </>
                )}
              </>
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={isPaymentDialogOpen}
        onOpenChange={(open) => {
          if (!open) handlePaymentDialogClose(); // Only allow closing via your handler
        }}
      >
        <DialogContent
          className="h-[500px] w-[80%] max-w-lg overflow-y-auto rounded-2xl p-0"
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
            className="h-[600px] w-full overflow-y-auto border-0"
          ></iframe>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PersonalDineOrder;
