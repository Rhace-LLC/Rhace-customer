import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, CheckCircle } from "lucide-react";

import { ContentHOC } from "@/components/nocontent";
import { DishDetailSheet } from "@/components/sheets/DishDetailSheet";
import { useAuth } from "@/contexts/AuthContext";
import { addToCart, increaseQuantity, reduceQuantity } from "@/store/orderCart.slice";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";
import { useMenuData } from "./useMenuData";


export const RenderMenuCategoryDishes = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const selectedRestaurant = useSelectedRestaurant();

  // Redux store
  const menuStore = useSelector((state: RootState) => state.menuUpdated);
  const { restaurant, categories, menuItems } = menuStore;

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedDish, setSelectedDish] = useState<any | null>(null);

  // Menu fetching hook
  const { loading: fetchAllDishesLoading, error: fetchAllDishesError, fetchMenuData } =
    useMenuData(selectedRestaurant.restaurantId || "");

  // Fetch menu on mount or when restaurant changes
  useEffect(() => {
    if (selectedRestaurant.restaurantId) fetchMenuData();
  }, [selectedRestaurant.restaurantId]);

  // Filter dishes by selected category
  const filteredDishes = selectedCategory
    ? menuItems.filter((dish) => dish.category.id === selectedCategory)
    : menuItems;

  // Cart selectors/helpers
  const orderCart = useSelector((state: RootState) => state.orderCart);

  const getDishQuantity = (dishId: string) => {
    const item = orderCart.data.find((cartItem) => cartItem.dishData.id === dishId);
    return item ? item.quantity : 0;
  };

  const isInCart = (dishId: string) =>
    orderCart.data.some((cartItem) => cartItem.dishData.id === dishId && cartItem.added);

  const handleAddToCart = (dish: any) => {
    dispatch(addToCart(dish));
  };
  const handleIncrease = (dish: any) => dispatch(increaseQuantity(dish));
  const handleDecrease = (dish: any) => dispatch(reduceQuantity(dish));

  return (
    <div className="pt-5 px-4">
      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
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
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <img
                src={dish.image_url || undefined}
                alt={dish.name}
                className="mb-3 h-32 w-full rounded-lg object-cover"
              />
              <h4 className="!my-2 font-medium">{dish.name}</h4>
              <p className="text-muted-foreground !mb-4 line-clamp-2 text-sm">
                {dish.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-medium">₦{dish.price}</span>
                <div className="flex items-center gap-1">
                  {dish.available ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Available</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Unavailable</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleDecrease(dish)}
                    variant="outline"
                    className="text-muted-foreground hover:bg-muted/80 h-8 w-8 cursor-pointer rounded-full p-5 transition active:scale-95"
                  >
                    –
                  </Button>
                  <span className="text-sm font-medium select-none">{getDishQuantity(dish.id)}</span>
                  <Button
                    variant="outline"
                    className="text-muted-foreground hover:bg-muted/80 h-8 w-8 cursor-pointer rounded-full p-5 transition active:scale-95"
                    onClick={() => handleIncrease(dish)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  disabled={isInCart(dish.id)}
                  onClick={() => !isInCart(dish.id) && handleAddToCart(dish)}
                  className={`flex w-full cursor-pointer items-center justify-center gap-2 transition active:scale-95 ${
                    isInCart(dish.id)
                      ? "cursor-not-allowed bg-gray-300 text-gray-600"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isInCart(dish.id) ? "Added" : "Add To Order"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
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
