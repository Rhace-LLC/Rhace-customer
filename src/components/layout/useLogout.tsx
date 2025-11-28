import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "@/contexts/AuthContext";
import { clearMenu } from "@/store/menuupdated.slice";
import { clearNotifications } from "@/store/notification.slice";
import { clearCart } from "@/store/orderCart.slice";
import { clearTransactionData } from "@/store/paymentTranxSlice";
import { clearReservationData } from "@/store/reservation.slice";
import { clearRestaurantData } from "@/store/restaurants_slice";
import { clearSelection } from "@/store/restaurant_selection.slice";
import { clearProfile } from "@/store/userSlice";

export const useLogout = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    // Clear auth state from Redux
    auth.logout();

    dispatch(clearMenu());
    dispatch(clearNotifications());
    dispatch(clearCart());
    dispatch(clearTransactionData());
    dispatch(clearReservationData());
    dispatch(clearRestaurantData());
    dispatch(clearSelection());
    dispatch(clearProfile());
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  }, [dispatch, navigate]);

  return { logout };
};
