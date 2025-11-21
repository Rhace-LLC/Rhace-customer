import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "@/contexts/AuthContext";
import { parseError } from "@/api-services/utils/parseError";
import { getMenuItems } from "@/api-services/menu.service"; // your API function
import { setMenu } from "@/store/menuupdated.slice";
import { useSelectedRestaurant } from "@/store/useSelectedRestaurant";

export function useMenuData() {
  const selectedRestaurant = useSelectedRestaurant();
  const restaurantId = selectedRestaurant.restaurantId || "";
  const dispatch = useDispatch();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMenuData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch menu from API
      const res = await getMenuItems(restaurantId, auth.token); // assuming API takes restaurantId and token

      dispatch(setMenu(res));
    } catch (err) {
      console.error(err);
      setError(parseError(err) || "Failed to fetch menu.");
    } finally {
      setLoading(false);
    }
  }, [dispatch, restaurantId, auth]);

  return {
    loading,
    error,
    fetchMenuData,
  };
}
