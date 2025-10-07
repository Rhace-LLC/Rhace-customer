import { X, MapPin, Clock, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface OrderDetailSheetProps {
  order: any;
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
    { key: "placed", label: "Order Placed", completed: true },
    {
      key: "preparing",
      label: "Preparing",
      completed: order.status !== "placed",
    },
    {
      key: "ready",
      label: "Ready",
      completed: ["ready", "served", "delivered"].includes(order.status),
    },
    {
      key: "served",
      label: "Served",
      completed: ["served", "delivered"].includes(order.status),
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Order Details</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Order {order.id}</h3>
              <Badge
                className={
                  order.status === "preparing"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-green-100 text-green-800"
                }
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">{order.orderTime}</p>
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
                      step.completed
                        ? "text-foreground"
                        : "text-muted-foreground"
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
              {order.items.map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
                >
                  <span className="text-sm">{item}</span>
                  <span className="text-sm font-medium">
                    ${Math.floor(order.total / order.items.length)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="text-lg font-bold">${order.total}</span>
          </div>

          {/* Restaurant Info */}
          <div className="rounded-lg bg-gray-50 p-3">
            <h4 className="mb-2 font-medium">Restaurant Info</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>123 Gourmet Street, Food District</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              {order.estimatedTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{order.estimatedTime}</span>
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
                onCancelOrder(order.id);
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
