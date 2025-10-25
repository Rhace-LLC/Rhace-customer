import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import menuReducer from "./menu.slice";
import orderCartReducer from "./orderCart.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
    orderCart: orderCartReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
