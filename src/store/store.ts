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
import groupBillReducer from "./groupbill.slice";
import { loadCart, saveCart } from "@/lib/diningSession";
import type { CartItemData } from "./orderCart.slice";

// The cart survives a refresh: guests often reload mid-order.
const savedCart = loadCart<CartItemData[]>();

export const store = configureStore({
  preloadedState: savedCart?.length
    ? { orderCart: { data: savedCart, activeOrder: null } }
    : undefined,
  reducer: {
    profile: userReducer,
    orderCart: orderCartReducer,
    restaurant: restaurantReducer,
    reservations: reservationReducer,
    restaurants: restaurantsReducer,
    paymentTransactions: paymentTranxReducer,
    notifications: notificationReducer,
    menuUpdated: menuUpdatedReducer,
    table_order: tableOrderReducer,
    unpaid_uncompleted_orders: unpaiduncompletedReducer,
    group_order: groupOrderReducer,
    groupBill: groupBillReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

let lastCart = store.getState().orderCart.data;
store.subscribe(() => {
  const cart = store.getState().orderCart.data;
  if (cart === lastCart) return;
  lastCart = cart;
  saveCart(cart.length ? cart : null);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
