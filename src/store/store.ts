import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import menuReducer from "./menu.slice";
import orderCartReducer from "./orderCart.slice";
import restaurantSelectionReducer from "./restaurant_selection.slice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
    orderCart: orderCartReducer,
    selectedRestaurant: restaurantSelectionReducer
  },
  devTools: import.meta.env.MODE !== "production",
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
