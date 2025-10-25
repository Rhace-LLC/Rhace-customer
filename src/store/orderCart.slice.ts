import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuDishData } from "@/api-services/menu.service";

// ---------------- Helper ----------------
export interface CategoryData {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// ---------------- Types ----------------
export interface CartItemData {
  id: number;
  categoryId: number;
  added: boolean;
  quantity: number;
  dishData: MenuDishData;
}

interface CartItemState {
  data: CartItemData[];
}

// ---------------- Initial State ----------------
const initialState: CartItemState = {
  data: [],
};

// ---------------- Slice ----------------
const CartItemSlice = createSlice({
  name: "CartItem",
  initialState,
  reducers: {
    // ✅ Add dish officially to cart
    addToCart: (state, action: PayloadAction<MenuDishData>) => {
      const dish = action.payload;
      const existing = state.data.find((item) => item.dishData.id === dish.id);

      if (existing) {
        // Just mark it as officially added
        existing.added = true;
      } else {
        // Add new dish to cart
        state.data.push({
          id: dish.id as unknown as number,
          categoryId: dish.category.id,
          added: true,
          quantity: 1,
          dishData: dish,
        });
      }
    },

    // ✅ Increase quantity
    increaseQuantity: (state, action: PayloadAction<MenuDishData>) => {
      const dish = action.payload;
      const existing = state.data.find((item) => item.dishData.id === dish.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        // Add with quantity 1 but not officially added yet
        state.data.push({
          id: dish.id as unknown as number,
          categoryId: dish.category.id,
          added: true,
          quantity: 1,
          dishData: dish,
        });
      }
    },

    // ✅ Reduce quantity
    reduceQuantity: (state, action: PayloadAction<MenuDishData>) => {
      const dish = action.payload;
      const existing = state.data.find((item) => item.dishData.id === dish.id);

      if (existing) {
        existing.quantity -= 1;
        if (existing.quantity <= 0) {
          // Remove item from cart
          state.data = state.data.filter(
            (item) => item.dishData.id !== dish.id
          );
        }
      }
    },
  },
});

// ---------------- Exports ----------------
export const { addToCart, increaseQuantity, reduceQuantity } =
  CartItemSlice.actions;
export default CartItemSlice.reducer;
