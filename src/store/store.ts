import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import orderCartReducer from "./orderCart.slice";
import reservationReducer from "./reservation.slice";
import restaurantsReducer from "./restaurants_slice";
import paymentTranxReducer from "./paymentTranxSlice";
import notificationReducer from "./notification.slice";
import menuUpdatedReducer from "./menuupdated.slice";
import restaurantReducer from "./restaurant.slice";
import tableOrderReducer from "./table_order.slice";
import unpaiduncompletedReducer from "./unpaidanduncompletedorder.slice";
import groupOrderReducer from "./group_order.slice";

export const store = configureStore({
  reducer: {
    profile: userReducer,
    orderCart: orderCartReducer,
    reservations: reservationReducer,
    restaurants: restaurantsReducer,
    paymentTransactions: paymentTranxReducer,
    notifications: notificationReducer,
    menuUpdated: menuUpdatedReducer,
    restaurant: restaurantReducer,
    table_order: tableOrderReducer,
    unpaid_uncompleted_orders: unpaiduncompletedReducer,
    group_order: groupOrderReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
