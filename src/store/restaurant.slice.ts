// src/store/restaurant.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RestaurantProfile } from "@/api-services/restaurantProfile";

interface RestaurantState {
  [restaurantId: string]: RestaurantProfile | null;
}

const initialState: RestaurantState = {};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (
      state,
      action: PayloadAction<{ restaurantId: string; data: RestaurantProfile }>
    ) => {
      state[action.payload.restaurantId] = action.payload.data;
    },
    clearRestaurant: (
      state,
      action: PayloadAction<{ restaurantId: string }>
    ) => {
      state[action.payload.restaurantId] = null;
    },
  },
});

export const { setRestaurant, clearRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
