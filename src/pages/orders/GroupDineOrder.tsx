import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

import UserOrder from "./userorder";
import { useEffect, useState } from "react";
import { ShareDineDialog } from "./shareDialog";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import {
  createOrder,
  CreateOrderPayload,
  OrderItem,
} from "@/api-services/order.service";

import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { toast } from "sonner";
import { parseError } from "@/api-services/utils/parseError";
import { formatNumberWithDecimals } from "@/utils/utils";
import { useTableOrder } from "@/hooks/useTableOrder";
import MyTableOrders from "./myTableOrder";
import { clearCart } from "@/store/orderCart.slice";

const GroupDineOrder = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const orderCart = useSelector((state: RootState) => state.orderCart);
  const selectedRestaurant = useSelector(
    (state: RootState) => state.selectedRestaurant
  );
  const { setLoading, setLoadingText } = useLoading();
  const navigate = useNavigate();

  const { tableOrder } = useTableOrder();

  const tableOrderForMe =
    tableOrder.orders.filter((x) => x.customer == auth?.user?.id) || [];

  const tableOrderForOthers =
    tableOrder.orders.filter((x) => x.customer !== auth?.user?.id) || [];
  const groupedOrdersForOthers = tableOrderForOthers.reduce<
    Record<
      string,
      {
        customerName: string;
        orders: typeof tableOrderForOthers;
      }
    >
  >((acc, order) => {
    if (!acc[order.customer]) {
      acc[order.customer] = {
        customerName: order.customer_name_display,
        orders: [],
      };
    }

    acc[order.customer].orders.push(order);
    return acc;
  }, {});

  const hasCartItems = orderCart.data.length > 0;
  const hasActiveOrders = tableOrderForMe.length > 0;

  const { fetchTableOrder } = useTableOrder();

  useEffect(() => {
    fetchTableOrder();
  }, []);

  const handleSubmitOrder = async () => {
    if (!auth.isAuthenticated) {
      toast.info("You need to be logged in to checkout");
      navigate(`/login?next=orders`);
      return;
    }

    try {
      setLoading(true);
      setLoadingText("Submitting Order");

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
      fetchTableOrder();
      dispatch(clearCart());
    } catch (error) {
      const errmsg = parseError(error);
      toast.error(errmsg || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const cartItems = orderCart.data || [];

  // 🧮 Calculate total
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.dishData.price || "0");
    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    fetchTableOrder();
  }, []);

  return (
    <>
      {orderCart.data.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Group Dining
            </h1>

            <p className="text-foreground/60 text">
              Dining together with others.
            </p>
          </div>
          <button
            onClick={() => setShareDialogOpen(true)}
            className="bg-primary/10 text-primary-600 text h-12 cursor-pointer rounded-md px-2 font-medium"
          >
            Share Dine Invite
          </button>
        </div>
      )}
      <MyTableOrders />
      <UserOrder />

      {(hasCartItems || hasActiveOrders) && (
        <div className="animate-in fade-in slide-in-from-bottom-4 mt-6 duration-500">
          {/* Divider */}
          <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              {/* SUBMIT CART ORDER */}
              {hasCartItems && (
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
                    onClick={handleSubmitOrder}
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black px-8 text-[16px] font-semibold tracking-[0.2em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-gray-900 active:scale-95"
                  >
                    Submit Order
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </>
              )}

              {/* SETTLE BILL */}
              {hasActiveOrders && (
                <Link to="/bill-settlement" className="w-full sm:w-auto">
                  <button className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black px-8 text-[16px] font-semibold tracking-[0.2em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-gray-900 active:scale-95">
                    Settle Bill
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION HEADER --- */}
      <div className="mt-8 mb-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-100" />
        <p className="text-[16px] font-medium tracking-tight text-gray-400">
          See what your table group are ordering
        </p>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <div className="space-y-4">
        {Object.entries(groupedOrdersForOthers).map(([customerId, group]) => {
          const allItems = group.orders.flatMap((o) => o.items);

          const totalAmount = group.orders.reduce(
            (sum, o) => sum + Number(o.total_price),
            0
          );

          return (
            <div
              key={customerId}
              className="rounded-2xl border border-gray-100 bg-white p-5 transition-colors hover:border-gray-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[16px] font-semibold tracking-tight text-gray-900 ring-1 ring-gray-100 ring-inset">
                    {group.customerName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-semibold tracking-tight text-gray-900">
                      {group.customerName}
                    </p>
                    <p className="text-[16px] text-gray-400">
                      {allItems.length} item(s) ordered
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[16px] font-medium tracking-widest text-gray-300 uppercase">
                    Total
                  </p>
                  <p className="font-semibold tracking-tighter text-gray-900">
                    ₦{totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-gray-50" />

              {/* Order Items */}
              <div className="space-y-3 px-1">
                {allItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-baseline justify-between"
                  >
                    <span className="tracking-tight text-gray-600">
                      {item.menu_item_name}
                    </span>
                    <span className="text-[16px] font-medium tracking-tighter text-gray-400 tabular-nums">
                      ₦{Number(item.price).toLocaleString()} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ShareDineDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </>
  );
};

export default GroupDineOrder;
