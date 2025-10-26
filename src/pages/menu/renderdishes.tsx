import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, CheckCircle } from "lucide-react";

import { getMenuItems, MenuDishData } from "@/api-services/menu.service";
import { ContentHOC } from "@/components/nocontent";
import { DishDetailSheet } from "@/components/sheets/DishDetailSheet";
import { useAuth } from "@/contexts/AuthContext";
import { updateMenuDishData } from "@/store/menu.slice";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import {
  addToCart,
  increaseQuantity,
  reduceQuantity,
} from "@/store/orderCart.slice";

interface RenderMenuCategoryDishesProps {
  categoryId: number;
}

export const RenderMenuCategoryDishes = ({
  categoryId,
}: RenderMenuCategoryDishesProps) => {
  const auth = useAuth();
  const dispatch = useDispatch();

  const [fetchAllDishesLoading, setFetchAllDishesLoading] = useState(false);
  const [fetchAllDishesError, setFetchAllDishesError] = useState("");
  const [selectedDish, setSelectedDish] = useState<any | null>(null);

  const dataStore = useSelector((state: RootState) => state.menu);
  const allData = dataStore.data;
  const dishes = allData[categoryId] || [];
  console.log("dishes", dishes, allData[categoryId]);

  const orderCart = useSelector((state: RootState) => state.orderCart);
  console.log("order Cart", orderCart);

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

  const handleAddToCart = (dish: MenuDishData) => {
    /*toast.success(
      `Added ${dish.name} to cart!`
    );*/

    dispatch(addToCart(dish));
  };

  const handleIncrease = (dish: MenuDishData) => {
    dispatch(increaseQuantity(dish));
  };

  const handleDecrease = (dish: MenuDishData) => {
    dispatch(reduceQuantity(dish));
  };

  // Fetch dishes when categoryId changes
  const fetchAllDishes = async () => {
    try {
      setFetchAllDishesLoading(true);
      setFetchAllDishesError("");

      const response = await getMenuItems(auth.token, { category: categoryId });
      dispatch(updateMenuDishData({ key: String(categoryId), data: response }));

      console.log("✅ Dishes fetched:", response);
    } catch (error: any) {
      console.error("❌ Error fetching dishes:", error);
      setFetchAllDishesError(error.message || "Failed to fetch dishes");
    } finally {
      setFetchAllDishesLoading(false);
    }
  };

  useEffect(() => {
    console.log("here", allData[categoryId]);
    if (!allData[categoryId]) fetchAllDishes();
  }, [categoryId]);
  /*

  const handleDishClick = (dish: any) => {
    setSelectedDish(dish);
  };
*/

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ContentHOC
        loading={fetchAllDishesLoading}
        error={!!fetchAllDishesError}
        noContent={dishes?.length === 0}
        loadingText="Fetching Dishes. Please Wait."
        noContentMessage="No dishes found for this category."
        noContentBtnText="Reload Dishes"
        noContentAction={fetchAllDishes}
        errMessage={fetchAllDishesError || "Failed to load dishes."}
        actionFn={fetchAllDishes}
      >
        {dishes &&
          dishes.map((dish, index) => (
            <div
              key={index}
              onClick={() => {
                //  handleDishClick(dish)
              }}
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
                  <span className="text-sm font-medium select-none">
                    {getDishQuantity(dish.id)}
                  </span>
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
                  onClick={() =>
                    !isInCart(dish.id) && dispatch(addToCart(dish))
                  }
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
