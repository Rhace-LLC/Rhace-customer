import { Clock, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Order } from "@/api-services/order.service";

interface OrderDetailSheetProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onCancelOrder?: (orderId: string) => void;
}

export function OrderDetailSheet({
  order,
  isOpen,
  onClose,
  onCancelOrder,
}: OrderDetailSheetProps) {
  if (!order) return null;

  const canCancel = order.status === "preparing";

  const statusSteps = [
    { key: "received", label: "Order Received", completed: true },
    {
      key: "preparing",
      label: "Preparing",
      completed: ["preparing", "ready", "served"].includes(order.status),
    },
    {
      key: "ready",
      label: "Ready",
      completed: ["ready", "served"].includes(order.status),
    },
    { key: "served", label: "Served", completed: order.status == "completed" },
  ];

  const totalPrice = Number(order.total_price);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full overflow-auto sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Order Details</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">
                Order #{order.id} - {order.customer_name}
              </h3>
              <Badge
                className={
                  order.status === "preparing"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-green-100 text-green-800"
                }
              >
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          {/* Status Tracker */}
          <div>
            <h4 className="mb-3 font-medium">Order Status</h4>
            <div className="space-y-3">
              {statusSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      step.completed ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      step.completed ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="mb-3 font-medium">Items</h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.menu_item.image_url}
                      alt={item.menu_item.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div className="text-sm">
                      <div className="font-medium">{item.menu_item.name}</div>
                      <div className="text-gray-500">
                        Qty: {item.quantity} × NGN{" "}
                        {Number(item.menu_item.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    NGN{" "}
                    {(Number(item.menu_item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>NGN {totalPrice.toFixed(2)}</span>
          </div>

          {/* Customer Info */}
          <div className="rounded-lg bg-gray-50 p-3">
            <h4 className="mb-2 font-medium">Customer Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{order.customer_phone}</span>
              </div>
              {order.order_type && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{order.order_type.toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {canCancel && onCancelOrder && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                onCancelOrder(String(order.id));
                onClose();
              }}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
