import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MenuDishData } from "@/api-services/menu.service";

export interface CategoryData {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  image_url: string;
  created_at: string;
  updated_at: string;
}

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

const initialState: CartItemState = {
  data: [],
};

const CartItemSlice = createSlice({
  name: "CartItem",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<MenuDishData>) => {
      const dish = action.payload;
      const existing = state.data.find((item) => item.dishData.id === dish.id);

      if (existing) {
        existing.added = true;
      } else {
        state.data.push({
          id: dish.id as unknown as number,
          categoryId: dish.category.id,
          added: true,
          quantity: 1,
          dishData: dish,
        });
      }
    },

    increaseQuantity: (state, action: PayloadAction<MenuDishData>) => {
      const dish = action.payload;
      const existing = state.data.find((item) => item.dishData.id === dish.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.data.push({
          id: dish.id as unknown as number,
          categoryId: dish.category.id,
          added: true,
          quantity: 1,
          dishData: dish,
        });
      }
    },

    reduceQuantity: (state, action: PayloadAction<MenuDishData>) => {
      const dish = action.payload;
      const existing = state.data.find((item) => item.dishData.id === dish.id);

      if (existing) {
        existing.quantity -= 1;

        if (existing.quantity <= 0) {
          state.data = state.data.filter(
            (item) => item.dishData.id !== dish.id
          );
        }
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const dishId = action.payload;
      state.data = state.data.filter((item) => item.dishData.id !== dishId);
    },

    // -------------------------------
    // ✅ CLEAR CART REDUCER
    // -------------------------------
    clearCart: (state) => {
      state.data = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  reduceQuantity,
  clearCart,
} = CartItemSlice.actions;

export default CartItemSlice.reducer;
