import {
  Clock,
  CheckCircle,
  ChefHat,
  ArrowRight,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { OrderDetailSheet } from "@/components/sheets/OrderDetailSheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { MenuDishData } from "@/api-services/menu.service";
import moment from "moment"
import {
  addToCart,
  increaseQuantity,
  reduceQuantity,
  removeFromCart,
} from "@/store/orderCart.slice";
import { useNavigate } from "react-router-dom";
import OrderSummary from "./cartsummary";
import { getOrders } from "@/api-services/order.service";
import { useAuth } from "@/contexts/AuthContext";
import { ContentHOC } from "@/components/nocontent";

export function OrdersPage() {
  const auth = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  const handleCancelOrder = (orderId: string) => {
    toast.success(`Order ${orderId} has been cancelled.`);
  };

  const orderCart = useSelector((state: RootState) => state.orderCart);
  console.log("order Cart", orderCart);

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

  const isInCart = (dishId: string): boolean => {
    return orderCart.data.some(
      (cartItem) => cartItem.dishData.id === dishId && cartItem.added
    );
  };

  const [fetchUserOrdersLoading, setFetchUserOrdersLoading] = useState(false);
  const [fetchUserOrdersError, setFetchUserOrdersError] = useState("");
  const [userOrders, setUserOrders] = useState<any[]>([]); // ideally use OrderResponse[]

  // ✅ Fetch User Orders
  const fetchUserOrders = async () => {
    try {
      setFetchUserOrdersLoading(true);
      setFetchUserOrdersError("");

      const response = await getOrders(auth.token);
      console.log("✅ Orders Response:", response);

      // Adjust based on your API response structure
      setUserOrders(response);
    } catch (error: any) {
      console.error("❌ Error fetching user orders:", error);
      setFetchUserOrdersError(error.message || "Failed to fetch user orders");
    } finally {
      setFetchUserOrdersLoading(false);
    }
  };

  const pastOrders = [
    {
      id: "ORD-003",
      status: "preparing",
      items: ["Ribeye Steak", "Mashed Potatoes"],
      total: 52,
      orderTime: "Yesterday, 7:30 PM",
      date: "Dec 29, 2024",
    },
    {
      id: "ORD-004",
      status: "ready",
      items: ["Margherita Pizza", "Tiramisu"],
      total: 28,
      orderTime: "Dec 27, 6:45 PM",
      date: "Dec 27, 2024",
    },
    {
      id: "ORD-005",
      status: "served",
      items: ["Burrata Caprese", "Truffle Arancini"],
      total: 34,
      orderTime: "Dec 25, 8:00 PM",
      date: "Dec 25, 2024",
    },
    {
      id: "ORD-0078",
      status: "delivered",
      items: ["Python Steak", "Truffle Arancini"],
      total: 34,
      orderTime: "Dec 25, 8:00 PM",
      date: "Dec 25, 2024",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received" : return <Utensils className="h-5 w-5 text-amber-500" />
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
      case "received": return "bg-amber-100 text-amber-800";
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
        <Tabs defaultValue="cart" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="cart">Cart Summary</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="cart">
            {orderCart.data.length > 0 && (
              <div className="pb-24">
                {/* padding bottom to make space for sticky button */}
                {orderCart.data.map((item, index) => {
                  const dish = item.dishData;
                  return (
                    <div
                      key={index}
                      className="mb-5 cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      {/* Dish Image */}
                      <img
                        src={dish.image_url || "/placeholder-dish.jpg"}
                        alt={dish.name}
                        className="mb-3 h-36 w-full rounded-lg object-cover"
                      />

                      {/* Dish Info */}
                      <h4 className="mb-2 font-semibold text-gray-800">
                        {dish.name}
                      </h4>
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {dish.description}
                      </p>

                      {/* Price & Availability */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">
                          ₦{parseFloat(dish.price).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1">
                          {dish.available ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-500">
                                Available
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-400">
                                Unavailable
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="mt-4 flex items-center justify-between gap-3">
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

                        {/* Add/Remove Button */}
                        <Button
                          onClick={() => {
                            if (!isInCart(dish.id)) {
                              dispatch(addToCart(dish));
                            } else {
                              dispatch(removeFromCart(dish.id));
                            }
                          }}
                          className={`flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                            isInCart(dish.id)
                              ? "bg-amber-500 text-amber-900 hover:bg-amber-600 hover:text-amber-50 active:scale-95"
                              : "bg-black text-white hover:bg-gray-900 active:scale-95 active:bg-gray-800"
                          }`}
                        >
                          {isInCart(dish.id) ? "Remove" : "Add to Order"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {<OrderSummary />}
              </div>
            )}
            {orderCart.data.length == 0 && (
              // Empty State
              <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
                <div className="bg-primary/10 text-primary mb-6 animate-pulse rounded-full p-6 shadow-sm">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  No Items in Your Orders
                </h2>
                <p className="mb-6 max-w-sm text-sm text-gray-500">
                  Looks like you haven’t added anything yet. Browse our menu to
                  find something delicious to order.
                </p>
                <button
                  onClick={() => navigate("/menu")}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-full px-5 py-2.5 text-white shadow-md transition-all active:scale-95"
                >
                  Browse Menu
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <ContentHOC
                    loading={fetchUserOrdersLoading}
                    error={!!fetchUserOrdersError}
                    noContent={userOrders?.length === 0}
                    loadingText="Fetching Your Orders. Please Wait."
                    noContentMessage="Reload Your Orders List"
                    noContentBtnText="Reload Your Orders"
                    noContentAction={fetchUserOrders}
                    errMessage={fetchUserOrdersError || "Failed to load borrowers."}
                    actionFn={fetchUserOrders}
            >
                     {userOrders.map((order) => (
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
                          {moment(order.created_at).format("lll")}
                        </span>
                        <span className="font-medium">${order.total_price}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}    
            </ContentHOC>
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
