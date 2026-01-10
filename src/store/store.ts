import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import orderCartReducer from "./orderCart.slice";
import restaurantSelectionReducer from "./restaurant_selection.slice";
import reservationReducer from "./reservation.slice";
import restaurantsReducer from "./restaurants_slice";
import paymentTranxReducer from "./paymentTranxSlice";
import notificationReducer from "./notification.slice";
import menuUpdatedReducer from "./menuupdated.slice";
import restaurantReducer from "./restaurant.slice";

export const store = configureStore({
  reducer: {
    profile: userReducer,
    orderCart: orderCartReducer,
    selectedRestaurant: restaurantSelectionReducer,
    reservations: reservationReducer,
    restaurants: restaurantsReducer,
    paymentTransactions: paymentTranxReducer,
    notifications: notificationReducer,
    menuUpdated: menuUpdatedReducer,
    restaurant: restaurantReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
