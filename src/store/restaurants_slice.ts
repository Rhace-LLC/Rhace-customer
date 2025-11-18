import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ---------------- Helper ----------------
export function uniqueBy<T, K extends keyof T>(items: T[], key: K): T[] {
  const seen = new Set<T[K]>();
  return items.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

// ---------------- Types ----------------
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  owner?: string;
  created: string;
  updated: string;
}

// State type
interface RestaurantState {
  data: Record<string, Restaurant[]>; // grouped or paginated by key
  total: number; // useful for pagination
}

// ---------------- Initial State ----------------
const initialState: RestaurantState = {
  data: {},
  total: 0,
};

// ---------------- Slice ----------------
const RestaurantSlice = createSlice({
  name: "Restaurant",
  initialState,
  reducers: {
    // Add or update a restaurant in a specific page/group
    appendRestaurantToPage: (
      state,
      action: PayloadAction<{ key: string; item: Restaurant }>
    ) => {
      const { key, item } = action.payload;
      const current = state.data[key] || [];

      const updated = [item, ...current.filter((d) => d.id !== item.id)];
      state.data[key] = updated;
    },

    // Add or update multiple restaurants in a page/group
    updateRestaurantData: (
      state,
      action: PayloadAction<{ key: string; data: Restaurant[] }>
    ) => {
      const { key, data } = action.payload;
      state.data[key] = uniqueBy([...(state.data[key] || []), ...data], "id");
    },

    // Update a restaurant across all groups by ID
    updateRestaurantDataById: (state, action: PayloadAction<Restaurant>) => {
      Object.keys(state.data).forEach((key) => {
        state.data[key] = state.data[key].map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      });
    },

    // Remove a restaurant by ID across all groups
    removeRestaurantDataById: (state, action: PayloadAction<string>) => {
      Object.keys(state.data).forEach((key) => {
        state.data[key] = state.data[key].filter(
          (item) => item.id !== action.payload
        );
      });
    },

    // Update total count
    updateRestaurantTotal: (
      state,
      action: PayloadAction<{ total: number }>
    ) => {
      state.total = action.payload.total;
    },

    // Reset all restaurant data
    clearRestaurantData: (state) => {
      state.data = {};
      state.total = 0;
    },
  },
});

// ---------------- Exports ----------------
export const {
  appendRestaurantToPage,
  updateRestaurantData,
  updateRestaurantDataById,
  removeRestaurantDataById,
  updateRestaurantTotal,
  clearRestaurantData,
} = RestaurantSlice.actions;

export default RestaurantSlice.reducer;
