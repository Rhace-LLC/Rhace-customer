import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "@/contexts/AuthContext";
import { parseError } from "@/api-services/utils/parseError";
import {
  updateRestaurantData,
  updateRestaurantTotal,
} from "@/store/restaurants_slice";
import { listRestaurantProfiles } from "@/api-services/restaurantProfile";

export function useRestaurantData(page: number) {
  const dispatch = useDispatch();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all restaurants for this user's first restaurant or account
      const res = await listRestaurantProfiles(auth.token);

      // Store paginated data in Redux
      dispatch(updateRestaurantData({ key: String(page), data: res }));

      // Update total count (replace with dynamic total if API returns it)
      dispatch(updateRestaurantTotal({ total: 100 }));
    } catch (err) {
      console.error(err);
      setError(parseError(err) || "Failed to fetch restaurants.");
    } finally {
      setLoading(false);
    }
  }, [auth, dispatch, page]);

  return {
    loading,
    error,
    fetchAllData,
  };
}
