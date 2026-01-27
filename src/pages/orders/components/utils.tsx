import { ArrowRight, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import { MenuDishData } from "@/api-services/menu.service";
import { Button } from "@/components/ui/button";
import { increaseQuantity, reduceQuantity } from "@/store/orderCart.slice";
import { RootState } from "@/store/store";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CheckCircle } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

import { useDispatch, useSelector } from "react-redux";
import { Order, OrderStatus } from "@/api-services/order.service";
import {
  calculateOrderTotal,
  formatCurrency,
  formatDate,
} from "@/pages/utils/helpers";

export const FullScreenLoader = () => {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center gap-3">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Loading…</p>
    </div>
  );
};

interface FullScreenErrorProps {
  message: string;
  onRetry?: () => void;
}

const FullScreenError = ({ message, onRetry }: FullScreenErrorProps) => {
  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border bg-white p-6 text-center shadow-sm">
        <AlertTriangle className="text-destructive mx-auto mb-3 h-8 w-8" />

        <h2 className="mb-1 text-base font-semibold">Something went wrong</h2>

        <p className="text-muted-foreground mb-4 text-sm">{message}</p>

        {onRetry && (
          <Button
            variant="outline"
            className="flex w-full items-center justify-center gap-2"
            onClick={onRetry}
          >
            <RefreshCcw size={16} />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

export default FullScreenError;

export const CartUpdate = () => {
  const dispatch = useDispatch();

  const orderCart = useSelector((state: RootState) => state.orderCart);

  const handleIncrease = (dish: MenuDishData) => {
    dispatch(increaseQuantity(dish));
  };

  const handleDecrease = (dish: MenuDishData) => {
    dispatch(reduceQuantity(dish));
  };

  const getDishQuantity = (dishId: string): number => {
    const item = orderCart.data.find(
      (cartItem) => cartItem.dishData.id === dishId
    );
    return item ? item.quantity : 0;
  };

  return (
    <>
      <div className="my-3 border-t border-gray-100" />

      {orderCart.data.length > 0 && (
        <>
          <div className="space-y-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="mb-4 flex items-center justify-center">
                <p className="text-forground font-medium tracking-tighter">
                  You added these to your order
                </p>
              </div>

              <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              {orderCart.data.map((item, index) => {
                const dish = item.dishData;
                const quantity: number = getDishQuantity(dish.id);
                const unitPrice: number = Number(dish.price);
                const totalPrice: number = unitPrice * quantity;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {/* IMAGE: Rounded-2xl looks more modern than a pure circle for food */}
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <img
                          src={dish.image_url || "/placeholder-dish.jpg"}
                          alt={dish.name}
                          className="h-full w-full rounded-2xl object-cover shadow-sm transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <p className="text-forground mb-1 font-semibold tracking-tight">
                          {dish.name}
                        </p>
                        {/* Quantity Control */}
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleDecrease(dish)}
                            variant="outline"
                            className="text-muted-foreground hover:bg-muted/80 h-8 w-8 rounded-full transition active:scale-95"
                          >
                            –
                          </Button>

                          <span className="text-sm font-medium select-none">
                            {getDishQuantity(dish.id)}
                          </span>

                          <Button
                            onClick={() => handleIncrease(dish)}
                            variant="outline"
                            className="text-muted-foreground hover:bg-muted/80 h-8 w-8 rounded-full transition active:scale-95"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p>
                        <span className="font-medium text-gray-800">
                          <span className="font-medium">
                            ₦{totalPrice.toLocaleString("en-NG")}
                          </span>
                        </span>
                      </p>
                      <p>
                        <span className="text-sm font-medium text-gray-600">
                          {dish.price} x {getDishQuantity(dish.id)}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const NoCartItem = () => {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in mb-0 flex min-h-[25vh] flex-col items-center justify-center text-center duration-1000">
      {/* MINIMALIST ICON CONTAINER */}
      <div className="relative mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gray-50 ring-1 ring-gray-100 ring-inset">
        <div className="absolute inset-0 animate-pulse rounded-[2.5rem] bg-gray-100/40" />
        <ShoppingBag
          size={32}
          strokeWidth={1.2}
          className="relative text-gray-400"
        />
      </div>

      {/* TYPOGRAPHY BLOCK */}
      <div className="max-w-[280px] space-y-3">
        <h4 className="text-[10px] font-semibold tracking-[0.4em] text-blue-500 uppercase">
          Empty Cart
        </h4>
        <h2 className="text-2xl leading-tight font-semibold tracking-tighter text-gray-900">
          Your selection <br /> is empty
        </h2>
        <p className="text-[13px] leading-relaxed text-gray-400">
          Explore our menu to discover curated dishes crafted for your taste
          buds.
        </p>
      </div>

      {/* ACTION BUTTON */}
      <div className="mt-12 w-full max-w-[200px]">
        <button
          onClick={() => navigate("/menu")}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-black py-4 text-[11px] font-semibold tracking-[0.2em] text-white uppercase shadow-xl shadow-black/10 transition-all hover:bg-gray-800 active:scale-95"
        >
          Explore Menu
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* SUBTLE DECORATIVE ELEMENT */}
      <div className="mt-16 flex gap-1">
        <div className="h-1 w-1 rounded-full bg-gray-200" />
        <div className="h-1 w-8 rounded-full bg-gray-100" />
        <div className="h-1 w-1 rounded-full bg-gray-200" />
      </div>
    </div>
  );
};

export const UserCart = () => {
  const dispatch = useDispatch();

  const orderCart = useSelector((state: RootState) => state.orderCart);

  const handleIncrease = (dish: MenuDishData) => {
    dispatch(increaseQuantity(dish));
  };

  const handleDecrease = (dish: MenuDishData) => {
    dispatch(reduceQuantity(dish));
  };

  const getDishQuantity = (dishId: string): number => {
    const item = orderCart.data.find(
      (cartItem) => cartItem.dishData.id === dishId
    );
    return item ? item.quantity : 0;
  };

  return (
    <>
      <div className="my-3 border-t border-gray-100" />

      {orderCart.data.length > 0 && (
        <>
          <div className="space-y-4">
            <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 transition-colors hover:border-gray-200">
              {/* Header */}
              <div className="mb-4 flex items-center justify-center">
                <p className="text-forground font-medium tracking-tighter">
                  Items in your cart
                </p>
              </div>

              <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              {orderCart.data.map((item, index) => {
                const dish = item.dishData;
                const quantity: number = getDishQuantity(dish.id);
                const unitPrice: number = Number(dish.price);
                const totalPrice: number = unitPrice * quantity;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {/* IMAGE: Rounded-2xl looks more modern than a pure circle for food */}
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <img
                          src={dish.image_url || "/placeholder-dish.jpg"}
                          alt={dish.name}
                          className="h-full w-full rounded-2xl object-cover shadow-sm transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <p className="text-forground mb-1 font-semibold tracking-tight">
                          {dish.name}
                        </p>
                        {/* Quantity Control */}
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleDecrease(dish)}
                            variant="outline"
                            className="text-muted-foreground hover:bg-muted/80 h-8 w-8 rounded-full transition active:scale-95"
                          >
                            –
                          </Button>

                          <span className="text-sm font-medium select-none">
                            {getDishQuantity(dish.id)}
                          </span>

                          <Button
                            onClick={() => handleIncrease(dish)}
                            variant="outline"
                            className="text-muted-foreground hover:bg-muted/80 h-8 w-8 rounded-full transition active:scale-95"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p>
                        <span className="font-medium text-gray-800">
                          <span className="font-medium">
                            ₦{totalPrice.toLocaleString("en-NG")}
                          </span>
                        </span>
                      </p>
                      <p>
                        <span className="text-sm font-medium text-gray-600">
                          x {getDishQuantity(dish.id)}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles: Record<OrderStatus, string> = {
    received: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    preparing: "bg-blue-100 text-blue-700",
    delivered: "bg-purple-100 text-purple-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
};

interface ActiveOrderViewProps {
  orders: Order[];
}

export const ActiveOrderView = ({ orders }: ActiveOrderViewProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          View order
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Active Orders</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="space-y-4 rounded-xl border bg-white p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Order #{order.id}
                  </p>
                  <p className="font-semibold">{order.restaurant_name}</p>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(order.created_at)}
                  </p>
                </div>

                <OrderStatusBadge status={order.status} />
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">
                    {order.customer_name_display || order.customer_name}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Order Type</p>
                  <p className="font-medium capitalize">
                    {order.order_type.replace("-", " ")}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Table</p>
                  <p className="font-medium">{order.table_number || "—"}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Payment</p>
                  <p className="font-medium">{order.payment}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Items</p>

                <div className="divide-y rounded-lg border">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{item.menu_item_name}</p>
                        <p className="text-muted-foreground">
                          Qty {item.quantity}
                        </p>
                      </div>

                      <p className="font-medium">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t pt-3">
                <div>
                  <p className="text-muted-foreground text-sm">Total</p>
                  <p className="font-semibold">
                    {formatCurrency(order.total_price)}
                  </p>
                </div>

                {order.is_paid && (
                  <p className="text-sm font-medium text-green-600">
                    Paid {formatDate(order.paid_at)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Clock } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";

export const UnpaidOrderCard = ({ data }: { data: Order[] }) => {
  const orderCart = useSelector((state: RootState) => state.orderCart);
  const order = data[0];

  const cartItems = orderCart.data || [];

  // 🧮 Calculate total
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.dishData.price || "0");
    return sum + price * item.quantity;
  }, 0);
  const orderTotal = calculateOrderTotal(order);
  const grandTotal = orderTotal + totalPrice;

  return (
    <div className="space-y-8 rounded-[2rem] border border-gray-100 bg-white p-5 pt-5 shadow-sm transition-all hover:shadow-md">
      {/* Header */}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">
              Order Received
            </h3>
            {/* Meta */}
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={12} strokeWidth={2.5} />
              <span className="text-[14px] font-normal tracking-tight">
                {moment(order.created_at).format("lll")}
              </span>
            </div>
          </div>
          <div className="flex w-max flex-col items-end justify-end gap-1">
            <span className="text-[14px] font-medium tracking-[0.2em] text-gray-400 uppercase">
              ID: #{order.id}
            </span>
            <div className="mb-1 flex w-max items-center gap-2 rounded-full">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              <span
                className={cn(
                  "text-[12px] font-bold tracking-[0.15em] uppercase",
                  {
                    pending: "text-amber-600",
                    paid: "text-emerald-600",
                    failed: "text-rose-600",
                  }[order.payment] || "text-gray-400"
                )}
              >
                {order.payment === "paid"
                  ? "Payment Confirmed"
                  : order.payment === "failed"
                    ? "Payment Failed"
                    : "Payment Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mb-0 space-y-4">
        <p className="text-[14px] font-medium tracking-[0em] text-gray-500 uppercase">
          Order Items
        </p>

        <div className="divide-y divide-gray-50">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between py-4 transition-colors first:pt-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="text-md font-semibold tracking-tight text-gray-800">
                  {item.menu_item_name}
                </p>
                <p className="text-[14px] font-normal text-gray-400">
                  Quantity: {item.quantity}
                </p>
                <div className="!hidden items-center rounded-2xl border border-gray-100 bg-gray-50/50 p-1.5 transition-all">
                  {/* DECREASE BUTTON */}
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm transition-all hover:bg-gray-100 hover:text-black active:scale-90 disabled:opacity-30">
                    <Minus size={14} strokeWidth={2.5} />
                  </button>

                  {/* QUANTITY DISPLAY */}
                  <span className="w-12 text-center text-[13px] font-semibold tracking-tight text-gray-900 tabular-nums">
                    {5}
                  </span>

                  {/* INCREASE BUTTON */}
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm transition-all hover:bg-gray-100 hover:text-black active:scale-90">
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p>
                  <span className="font-medium text-gray-800">
                    <span className="font-medium">
                      {formatCurrency(
                        String(Number(item.price))
                      )}
                    </span>
                  </span>
                </p>
                <p className="hidden">
                  <span className="text-sm font-medium text-gray-600">
                    {item.price} x {item.quantity}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CartUpdate />

      {/* Footer / Settlement Info */}
      <div className="flex flex-col items-center justify-center gap-5 border-t border-gray-50 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
            Total Statement
          </p>
          <p className="text-2xl font-semibold tracking-tighter text-gray-900">
            {formatCurrency(String(grandTotal))}
          </p>
        </div>
      </div>
    </div>
  );
};

interface OrderSubmissionConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderSubmissionConfirmation = ({
  open,
  onOpenChange,
}: OrderSubmissionConfirmationProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-xl text-center">
        <DialogHeader>
          <div className="mb-3 flex justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <DialogTitle className="text-lg">Submit Order</DialogTitle>

          <DialogDescription className="text-muted-foreground text-sm">
            Are you sure you got everything you need?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Button
            className="h-12 w-full cursor-pointer rounded-xl bg-black text-white hover:bg-gray-800"
            onClick={() => onOpenChange(false)}
          >
            Yes, Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
