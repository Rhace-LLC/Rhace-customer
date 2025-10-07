import { Clock, CheckCircle, ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { OrderDetailSheet } from "@/components/sheets/OrderDetailSheet";

export function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  const handleCancelOrder = (orderId: string) => {
    toast.success(`Order ${orderId} has been cancelled.`);
  };

  const activeOrders = [
    {
      id: "ORD-001",
      status: "preparing",
      items: ["Truffle Pasta", "Caesar Salad"],
      total: 35,
      orderTime: "2:30 PM",
      estimatedTime: "15 mins",
    },
    {
      id: "ORD-002",
      status: "ready",
      items: ["Grilled Salmon", "Garlic Bread"],
      total: 38,
      orderTime: "2:15 PM",
      estimatedTime: "Ready",
    },
  ];

  const pastOrders = [
    {
      id: "ORD-003",
      status: "delivered",
      items: ["Ribeye Steak", "Mashed Potatoes"],
      total: 52,
      orderTime: "Yesterday, 7:30 PM",
      date: "Dec 29, 2024",
    },
    {
      id: "ORD-004",
      status: "delivered",
      items: ["Margherita Pizza", "Tiramisu"],
      total: 28,
      orderTime: "Dec 27, 6:45 PM",
      date: "Dec 27, 2024",
    },
    {
      id: "ORD-005",
      status: "delivered",
      items: ["Burrata Caprese", "Truffle Arancini"],
      total: 34,
      orderTime: "Dec 25, 8:00 PM",
      date: "Dec 25, 2024",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "preparing":
        return <ChefHat className="h-5 w-5 text-orange-500" />;
      case "ready":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "served":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "served":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-5">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="past">Past Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <Card
                  key={order.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => handleOrderClick(order)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Order {order.id}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      {getStatusIcon(order.status)}
                      <div className="flex-1">
                        <p className="text-muted-foreground mb-1 text-sm">
                          {order.items.join(", ")}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            {order.orderTime}
                          </span>
                          <span className="font-medium">${order.total}</span>
                        </div>
                        <p className="text-primary mt-1 text-sm font-medium">
                          {order.estimatedTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <ChefHat className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <p className="text-muted-foreground">No active orders</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastOrders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => handleOrderClick(order)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Order {order.id}
                    </CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(order.status)}
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-1 text-sm">
                        {order.items.join(", ")}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          {order.orderTime}
                        </span>
                        <span className="font-medium">${order.total}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <OrderDetailSheet
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancelOrder={handleCancelOrder}
      />
    </div>
  );
}
