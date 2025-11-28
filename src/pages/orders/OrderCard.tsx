import { Clock, CheckCircle, Loader2, XCircle, Badge } from "lucide-react";
import moment from "moment";
import { Order } from "@/api-services/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrdersOverviewProps {
  userOrders: Order[];
  onOrderClick?: (order: Order) => void;
}

export function OrdersOverview({
  userOrders,
  onOrderClick,
}: OrdersOverviewProps) {
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
        return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />;
      case "ready":
      case "served":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
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
                  {order.items.map((item) => item.menu_item.name).join(", ")}
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
