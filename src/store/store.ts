import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import menuReducer from "./menu.slice";
import orderCartReducer from "./orderCart.slice";
import restaurantSelectionReducer from "./restaurant_selection.slice";
import reservationReducer from "./reservation.slice";
import restaurantsReducer from "./restaurants_slice";
import paymentTranxReducer from "./paymentTranxSlice";
import notificationReducer from "./notification.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
    orderCart: orderCartReducer,
    selectedRestaurant: restaurantSelectionReducer,
    reservations: reservationReducer,
    restaurants: restaurantsReducer,
    paymentTransactions: paymentTranxReducer,
    notifications: notificationReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
