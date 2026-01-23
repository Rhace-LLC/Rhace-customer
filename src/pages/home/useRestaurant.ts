import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseError } from "@/api-services/utils/parseError";
import { useAuth } from "@/contexts/AuthContext";
import { getRestaurantProfile } from "@/api-services/restaurantProfile";
import { useSetupContext } from "@/contexts/SetupContext";
import { RootState } from "@/store/store";
import { setRestaurant } from "@/store/restaurant.slice";

export const useRestaurant = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const setup = useSetupContext();

  const restaurantId = setup.selectedRestaurant?.restaurantId;

  const restaurant = useSelector((state: RootState) => {
    return restaurantId ? (state.restaurant[restaurantId] ?? null) : null;
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchRestaurant = async () => {
    if (!restaurantId) {
      return;
    }
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

  return {
    restaurant,
    loading,
    error,
    refetch: fetchRestaurant,
  };
};
