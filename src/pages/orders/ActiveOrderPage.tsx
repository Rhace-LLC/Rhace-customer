import { useUnpaidUncompleted } from "./hook/useUnpaidUncompleted";
import {
  formatCurrency,
  formatDate,
  getOrderStatusText,
} from "../utils/helpers";
import { OrderStatusBadge } from "./components/utils";

const ActiveOrderPage = () => {
  const { uncompletedOrders } = useUnpaidUncompleted();

  return (
    <div className="mx-auto max-w-3xl space-y-12 p-6 py-12">
      {/* PAGE HEADER */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tighter text-gray-900">
          Active Orders
        </h1>
        <p className="text-sm font-medium text-gray-400">
          Track and manage your current table sessions in real-time.
        </p>
      </div>

      <div className="space-y-10">
        {uncompletedOrders.map((order) => (
          <div
            key={order.id}
            className="group relative space-y-8 rounded-[1rem] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            {/* CARD HEADER */}
            <div className="mb-0 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-blue-500 uppercase">
                    Order #{order.id}
                  </span>
                  <div className="h-1 w-1 rounded-full bg-gray-200" />
                  <span className="text-[11px] font-medium text-gray-400">
                    {formatDate(order.created_at)}
                  </span>
                  <div className="w-fit">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <h2 className="hidden text-xl font-semibold tracking-tight text-gray-900">
                  {order.restaurant_name}
                </h2>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[0.5rem] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              {/* The Status Accent Bar - visual cue that changes with the state */}
              <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-500/80" />

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {/* Live Status Indicator */}
                  <div className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                  </div>

                  <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                    Order Status Update
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[13px] leading-relaxed text-gray-500">
                    {getOrderStatusText(order.status)}
                  </p>
                </div>
              </div>
            </div>

            {/* META INFO GRID */}
            <div className="mt-5 hidden grid-cols-2 gap-y-6 rounded-md bg-gray-100 p-4 sm:grid-cols-4">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                  Customer
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {order.customer_name_display || order.customer_name}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                  Type
                </p>
                <p className="text-sm font-semibold text-gray-700 capitalize">
                  {order.order_type.replace("-", " ")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                  Table
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {order.table_number || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                  Payment
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {order.payment}
                </p>
              </div>
            </div>

            {/* ITEMS LIST */}
            <div className="mt-5 space-y-4">
              <p className="mb-0 px-1 pb-0 text-[10px] font-semibold tracking-[0.2em] text-gray-300 uppercase">
                Menu Selection
              </p>
              <div className="divide-y divide-gray-50 border-t border-gray-50">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 transition-colors hover:bg-gray-50/30"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold tracking-tight text-gray-800">
                        {item.menu_item_name}
                      </p>
                      <p className="text-[11px] font-medium text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold tracking-tighter text-gray-900 tabular-nums">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col gap-6 border-t border-gray-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">
                  Order Total:
                </p>
                <p className="text-3xl font-semibold tracking-tighter text-gray-900">
                  {formatCurrency(order.total_price)}
                </p>
              </div>

              {order.is_paid && (
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 ring-1 ring-emerald-100/50 ring-inset">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] font-semibold tracking-widest text-emerald-700 uppercase">
                    Paid {formatDate(order.paid_at)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="py-8" />
    </div>
  );
};

export default ActiveOrderPage;
