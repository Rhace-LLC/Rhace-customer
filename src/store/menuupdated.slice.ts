import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Category,
  GetMenuResponse,
  MenuItem,
  Restaurant,
} from "@/api-services/menu.service";

interface MenuState {
  restaurant: Restaurant | null;
  categories: Category[];
  menuItems: MenuItem[];
}

const initialState: MenuState = {
  restaurant: null,
  categories: [],
  menuItems: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    // Replace entire menu state
    setMenu(state, action: PayloadAction<GetMenuResponse>) {
      state.restaurant = action.payload.restaurant;
      state.categories = action.payload.categories;
      state.menuItems = action.payload.menu_items;
    },

    // Add new menu items (or categories)
    addMenuItems(state, action: PayloadAction<MenuItem[]>) {
      state.menuItems.push(...action.payload);
    },
    addCategories(state, action: PayloadAction<Category[]>) {
      state.categories.push(...action.payload);
    },

    // Update a single menu item by ID
    updateMenuItem(state, action: PayloadAction<MenuItem>) {
      const index = state.menuItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) state.menuItems[index] = action.payload;
    },

    // Clear the menu state
    clearMenu(state) {
      state.restaurant = null;
      state.categories = [];
      state.menuItems = [];
    },
  },
});

export const {
  setMenu,
  addMenuItems,
  addCategories,
  updateMenuItem,
  clearMenu,
} = menuSlice.actions;
export default menuSlice.reducer;
