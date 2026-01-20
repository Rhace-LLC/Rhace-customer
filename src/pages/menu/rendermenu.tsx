import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, CheckCircle } from "lucide-react";

import { ContentHOC } from "@/components/nocontent";
import { DishDetailSheet } from "@/components/sheets/DishDetailSheet";

import {
  addToCart,
  increaseQuantity,
  reduceQuantity,
} from "@/store/orderCart.slice";

import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";

import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";
import { useMenuData } from "./useMenuData";
import { MenuCatFilterItem } from "./MenuCatItem";
import { useUnpaidUncompleted } from "../orders/hook/useUnpaidUncompleted";
import { useDiningExperience } from "@/contexts/DiningExperienceContext";
import { useGroupOrder } from "@/hooks/useDineGroupOrder";
import { useAuth } from "@/contexts/AuthContext";

export const RenderMenuCategoryDishes = () => {
  const auth = useAuth();
  const dispatch = useDispatch();

  const selectedRestaurant = useSelectedRestaurant();
  const diningPreference = useDiningExperience();

  const { groupOrder } = useGroupOrder();

  const groupOrderForMe =
    groupOrder?.orders?.filter((x) => x.customer == auth?.user?.id) || [];

  // Redux store
  const menuStore = useSelector((state: RootState) => state.menuUpdated);
  const { categories, menuItems } = menuStore;

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDish, setSelectedDish] = useState<any | null>(null);

  // Menu fetching hook
  const {
    loading: fetchAllDishesLoading,
    error: fetchAllDishesError,
    fetchMenuData,
  } = useMenuData();

  // Fetch menu on mount or when restaurant changes
  useEffect(() => {
    if (selectedRestaurant.restaurantId && menuItems.length === 0)
      fetchMenuData();
  }, [selectedRestaurant.restaurantId]);

  // Filter dishes by selected category
  const filteredDishes = selectedCategory
    ? menuItems.filter((dish) => dish.category.id === selectedCategory)
    : menuItems;

  const { unpaidOrders } = useUnpaidUncompleted();
  // Cart selectors/helpers
  const orderCart = useSelector((state: RootState) => state.orderCart);

  const getDishQuantity = (dishId: string) => {
    const item = orderCart.data.find(
      (cartItem) => cartItem.dishData.id === dishId
    );
    return item ? item.quantity : 0;
  };

  const isInCart = (dishId: string) =>
    orderCart.data.some(
      (cartItem) => cartItem.dishData.id === dishId && cartItem.added
    );

  const isInOrder = (menuItemId: string) => {
    let item;
    if (diningPreference.preferredDiningExperience == "personal") {
      item = unpaidOrders[0];
    } else {
      item = groupOrderForMe[0];
    }
    if (!item) {
      return false;
    }
    return item.items.some((item) => item.menu_item_id === menuItemId);
  };

  const handleAddToCart = (dish: any) => {
    dispatch(addToCart(dish));
  };
  const handleIncrease = (dish: any) => dispatch(increaseQuantity(dish));
  const handleDecrease = (dish: any) => dispatch(reduceQuantity(dish));

  console.log("categories", categories);

  return (
    <div className="px-4 pt-5">
      {/* Category filter */}
      {categories.length > 0 && (
        <div className="min-w-0 overflow-x-auto pb-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* All Button */}
            <MenuCatFilterItem
              category={{
                id: 0,
                name: "All Category",
                description: "",
                image:
                  "https://images.unsplash.com/photo-1556742393-d75f468bfcb0",
              }}
              isActive={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
            />

            {/* Category Items */}
            {categories.map((cat) => (
              <MenuCatFilterItem
                key={cat.id}
                category={cat}
                isActive={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              />
            ))}
          </div>
        </div>
      )}

      <ContentHOC
        loading={fetchAllDishesLoading}
        error={!!fetchAllDishesError}
        noContent={filteredDishes.length === 0}
        loadingText="Fetching Dishes. Please Wait."
        noContentMessage="No dishes found for this category."
        noContentBtnText="Reload Dishes"
        noContentAction={fetchMenuData}
        errMessage={fetchAllDishesError || "Failed to load dishes."}
        actionFn={fetchMenuData}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className="relative min-h-84 cursor-pointer rounded bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="absolute top-0 left-0 z-1 w-full">
                <img
                  src={dish.image_url || undefined}
                  alt={dish.name}
                  className="absolute z-1 mb-3 h-84 w-full rounded-3xl object-cover"
                />
                <div className="absolute z-2 mb-3 h-84 w-full rounded-3xl bg-gradient-to-b from-transparent via-black/50 to-black" />
              </div>
              <div className="absolute bottom-0 left-0 z-2 w-full p-4">
                <h4 className="!my-2 truncate text-3xl font-bold tracking-tighter text-white">
                  {dish.name}
                </h4>

                <p className="!mb-4 line-clamp-2 text-sm text-white">
                  {dish.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold tracking-tight text-white">
                    ₦{dish.price}
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

                <div className="mt-4 flex items-center justify-between gap-3">
                  {/* Quantity Control */}
                  <div className="flex items-center gap-2">
                    <Button
                      disabled={isInOrder(dish.id)}
                      onClick={() => handleDecrease(dish)}
                      variant="outline"
                      className="h-9 w-8 cursor-pointer rounded-full border border-white/80 bg-transparent text-white transition hover:bg-white/10 active:scale-95"
                    >
                      –
                    </Button>
                    <span className="text-sm font-medium text-white select-none">
                      {getDishQuantity(dish.id)}
                    </span>
                    <Button
                      disabled={isInOrder(dish.id)}
                      onClick={() => handleIncrease(dish)}
                      variant="outline"
                      className="h-9 w-8 cursor-pointer rounded-full border border-white/80 bg-transparent text-white transition hover:bg-white/10 active:scale-95"
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    disabled={isInCart(dish.id) || isInOrder(dish.id)}
                    onClick={() =>
                      !(isInCart(dish.id) || isInOrder(dish.id)) &&
                      handleAddToCart(dish)
                    }
                    className={`flex h-10 w-max cursor-pointer items-center justify-center gap-2 rounded-full transition active:scale-95 ${
                      isInCart(dish.id) || isInOrder(dish.id)
                        ? "cursor-not-allowed bg-gray-200 text-gray-700"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {isInCart(dish.id) || isInOrder(dish.id)
                      ? "Added"
                      : "Add To Order"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ContentHOC>

      {/* Dish detail sheet */}
      <DishDetailSheet
        dish={selectedDish}
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
