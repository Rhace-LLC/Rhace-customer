import { Order } from "@/api-services/order.service";
import { useActiveOrder } from "@/hooks/useActiveOrder";
import { useEffect, useState } from "react";

export const ActiveOrdersPanel = () => {
  const { activeOrder, fetchActiveOrderRefresh } = useActiveOrder();

  const hasOrders = activeOrder && activeOrder.length > 0;

  useEffect(() => {
    const interval = setInterval(() => {
      fetchActiveOrderRefresh();
    }, 20_000);

    return () => clearInterval(interval);
  }, [fetchActiveOrderRefresh]);

  if (!hasOrders) {
    return null;
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            You have active orders
          </h3>
          <p className="text-sm text-gray-500">
            Track the status of your ongoing orders in real time
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {activeOrder.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const [showFullOrder, setShowFullOrder] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      {/* TOP SECTION */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-gray-800">Order #{order.id}</p>
          <p className="text-sm text-gray-500">
            {order.items.length} item(s) • ₦{order.total_price}
          </p>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              order.status === "received"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* VIEW FULL ORDER BUTTON */}
          <button
            onClick={() => setShowFullOrder((prev) => !prev)}
            className="text-primary-600 text-sm font-medium hover:underline"
          >
            {showFullOrder ? "Hide order" : "View full order"}
          </button>
        </div>
      </div>

      {/* FULL ORDER ITEMS */}
      {showFullOrder && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium text-gray-700">
                  {item.menu_item_name}
                </p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>

              <p className="font-medium text-gray-700">₦{item.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="hidden w-full flex-col gap-3 pt-8 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        {/* CANCEL BUTTON */}
        <button className="order-2 h-14 w-full rounded-2xl border border-gray-100 bg-white text-[16px] font-semibold text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-600 active:scale-95 sm:order-1 sm:w-40">
          Cancel Order
        </button>
      </div>
    </div>
  );
};
