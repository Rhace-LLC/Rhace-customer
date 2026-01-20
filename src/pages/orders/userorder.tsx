import { MenuDishData } from "@/api-services/menu.service";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTableOrder } from "@/hooks/useTableOrder";
import { increaseQuantity, reduceQuantity } from "@/store/orderCart.slice";
import { RootState } from "@/store/store";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserOrder = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderCart = useSelector((state: RootState) => state.orderCart);

  const { tableOrder } = useTableOrder();

  const tableOrderForMe =
    tableOrder.orders.filter((x) => x.customer == auth?.user?.id) || [];

  const hasOrders = tableOrderForMe.length > 0;

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

  if (!hasOrders) {
    return null;
  }

  return (
    <>
      <div className="my-3 border-t border-gray-100" />

      {orderCart.data.length == 0 && !hasOrders && (
        // Empty State
        <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 text-center">
          <div className="bg-primary/10 text-primary mb-6 animate-pulse rounded-full p-6 shadow-sm">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            You haven’t selected any dish.
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

export default UserOrder;
