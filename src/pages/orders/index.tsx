import { MenuDishData } from "@/api-services/menu.service";
import { Button } from "@/components/ui/button";
import { useDiningExperience } from "@/contexts/DiningExperienceContext";
import { increaseQuantity, reduceQuantity } from "@/store/orderCart.slice";
import { RootState } from "@/store/store";
import { CreditCard} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export function OrdersPage() {
  const dinePreference = useDiningExperience();
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="space-y-5 p-4 pt-8">
        {dinePreference.preferredDiningExperience === "group" ? (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                Group Dining
              </h1>

              <p className="text-foreground/60 text-sm">
                Dining together with others.
              </p>

              <p className="text-foreground/70 text-sm">
                Join code{" "}
                <span className="bg-muted text-foreground ml-1 rounded-md px-2 py-0.5 font-mono">
                  DI938X92942
                </span>
              </p>
            </div>
            <button className="bg-primary/10 text-primary-600 h-12 cursor-pointer rounded-md px-2 text-sm font-medium">
              Share Dine Invite
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">
              Personal Dining
            </h1>

            <p className="text-foreground/60 text-sm">
              A private dining experience, just for you.
            </p>
          </div>
        )}

        <div className="my-3 border-t border-gray-200" />

        <div className="mb-0 flex items-center justify-center">
          <p className="text-foreground/70 font-medium tracking-tighter">
            Your Order List
          </p>
          <button className="bg-foreground text-background hover:bg-foreground/90 focus:ring-foreground/40 flex hidden h-11 cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md focus:ring-2 focus:outline-none active:scale-95">
            Settle bill
            <CreditCard className="h-4 w-4" />
          </button>
        </div>

        <div className="my-3 border-t border-gray-200" />
        {orderCart.data
          .concat(orderCart.data)
          .concat(orderCart.data)
          .map((item, index) => {
            const dish = item.dishData;
            const quantity: number = getDishQuantity(dish.id);
            const unitPrice: number = Number(dish.price);
            const totalPrice: number = unitPrice * quantity;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={dish.image_url || "/placeholder-dish.jpg"}
                    alt={dish.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
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
                    <span className="font-medium text-gray-800">
                      x {getDishQuantity(dish.id)}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        <div className="my-3 border-t border-gray-200" />

        <div className="rounded-lg bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500">Order summary</p>
              <p className="text-sm text-gray-800">
                Your order total comes to{" "}
                <span className="font-medium text-gray-900">₦{`34,028`}</span>
              </p>
            </div>

<Link to={'/bill-settlement'} >

            <button className="cursor-pointer rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white transition hover:bg-gray-800 focus:ring-2 focus:ring-gray-900/30 focus:outline-none active:scale-95">
              Proceed to settle bill
            </button>
</Link>
          </div>
        </div>

        <div className="my-3 border-t border-gray-200" />

        <div className="mb-0 flex items-center justify-center">
          <p className="text-foreground/70 font-medium tracking-tighter">
            Others on the table ordered:
          </p>
        </div>

        <div className="my-3 border-t border-gray-200" />

        <div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
  {/* Header */}
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
      AY
    </div>

    <div className="leading-tight">
      <p className="text-sm font-medium text-gray-900">
        Adefuye Abayomi
      </p>
      <p className="text-xs text-gray-500">
        2 items ordered
      </p>
    </div>
  </div>

  {/* Divider */}
  <div className="my-3 h-px bg-gray-100" />

  {/* Order Items */}
  <div className="space-y-2">
    <div className="flex justify-between text-sm text-gray-800">
      <span>Jollof Rice</span>
      <span className="text-gray-600">₦3,000 × 2</span>
    </div>

    <div className="flex justify-between text-sm text-gray-800">
      <span>Grilled Chicken</span>
      <span className="text-gray-600">₦4,500 × 1</span>
    </div>
  </div>

  {/* Divider */}
  <div className="my-3 h-px bg-gray-100" />

  {/* Total */}
  <div className="flex justify-between text-sm font-medium text-gray-900">
    <span>Total</span>
    <span>₦10,500</span>
  </div>
</div>

        </div>
        <div></div>
      </div>
    </div>
  );
}
