import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseError } from "@/api-services/utils/parseError";
import { useAuth } from "@/contexts/AuthContext";
import { getRestaurantProfile } from "@/api-services/restaurantProfile";
import { RootState } from "@/store/store";
import { setRestaurant } from "@/store/restaurant.slice";

interface UseRestaurantProps {
  restaurantId: string;
}

export const useRestaurant = ({ restaurantId }: UseRestaurantProps) => {
  const auth = useAuth();
  const dispatch = useDispatch();

  // Pull restaurant from Redux store
  const restaurant = useSelector(
    (state: RootState) => state.restaurant[restaurantId] || null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getRestaurantProfile(restaurantId, auth.token);

      // Dispatch to store
      dispatch(setRestaurant({ restaurantId, data: res }));
    } catch (err) {
      setError(parseError(err) || "Failed to fetch restaurant data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId && !restaurant) {
      fetchRestaurant();
    }
  }, [restaurantId, restaurant]);

  return {
    restaurant,
    loading,
    error,
    refetch: fetchRestaurant,
  };
};
