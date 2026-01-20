import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { MenuDishData } from "@/api-services/menu.service";

import {
  addToCart,
  increaseQuantity,
  reduceQuantity,
  removeFromCart,
} from "@/store/orderCart.slice";

import { useNavigate } from "react-router-dom";
import OrderSummary from "./cartsummary";
import { getOrders, Order } from "@/api-services/order.service";
import { useAuth } from "@/contexts/AuthContext";

export function OldOrdersPage() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const isInCart = (dishId: string): boolean => {
    return orderCart.data.some(
      (cartItem) => cartItem.dishData.id === dishId && cartItem.added
    );
  };

  const [userOrders, setUserOrders] = useState<Order[]>([]); // ideally use OrderResponse[]

  // ✅ Fetch User Orders
  const fetchUserOrders = async () => {
    try {
      const response = await getOrders(auth.token);

      // Adjust based on your API response structure
      setUserOrders(response);
    } catch (error: any) {
    } finally {
    }
  };

  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");

  useEffect(() => {
    if (activeTab === "orders" && userOrders.length == 0) {
      fetchUserOrders();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-5">
        {orderCart.data.length > 0 && (
          <div className="pb-24">
            {/* padding bottom to make space for sticky button */}
            {orderCart.data.map((item, index) => {
              const dish = item.dishData;

              return (
                <div
                  key={index}
                  className="mb-4 cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar Image */}
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      <img
                        src={dish.image_url || "/placeholder-dish.jpg"}
                        alt={dish.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Dish Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {dish.name}
                      </h4>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {dish.description}
                      </p>
                    </div>
                  </div>
                  <div>
                    {/* Price & Availability */}
                    <div className="mt-3 flex items-center justify-between">
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

                    <div className="my-2 border border-gray-100" />

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

                      {/* Add / Remove */}
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
                </div>
              );
            })}

            {
              <OrderSummary
                OnCreateOrder={() => {
                  setActiveTab("orders");
                  fetchUserOrders();
                }}
              />
            }
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
              Looks like you haven’t added anything yet. Browse our menu to find
              something delicious to order.
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
      </div>
    </div>
  );
}
