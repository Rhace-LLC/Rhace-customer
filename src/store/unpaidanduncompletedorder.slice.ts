import { Order } from "@/api-services/order.service";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  unpaidOrders: Order[];
  uncompletedOrders: Order[];
}

const initialState: OrderState = {
  unpaidOrders: [],
  uncompletedOrders: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setUnpaidOrder(state, action: PayloadAction<Order[]>) {
      state.unpaidOrders = action.payload;
    },

    clearUnpaidOrders(state) {
      state.unpaidOrders = [];
    },

    setUncompletedOrder(state, action: PayloadAction<Order[]>) {
      state.uncompletedOrders = action.payload;
    },

    clearUncompletedOrders(state) {
      state.uncompletedOrders = [];
    },
  },
});

export const {
  setUnpaidOrder,
  clearUnpaidOrders,
  setUncompletedOrder,
  clearUncompletedOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
