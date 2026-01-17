import { Order } from "@/api-services/order.service";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TableOrderState {
  tableId: string | null;
  tableNumber: string | null;
  orders: Order[];
  totalAmount: number;
}

const initialState: TableOrderState = {
  tableId: null,
  tableNumber: null,
  orders: [],
  totalAmount: 0,
};

const tableOrderSlice = createSlice({
  name: "tableOrder",
  initialState,
  reducers: {
    setTableOrder(
      state,
      action: PayloadAction<{
        tableId: string;
        tableNumber: string;
        orders: Order[];
        totalAmount: number;
      }>
    ) {
      state.tableId = action.payload.tableId;
      state.tableNumber = action.payload.tableNumber;
      state.orders = action.payload.orders;
      state.totalAmount = action.payload.totalAmount;
    },

    clearTableOrder(state) {
      state.tableId = null;
      state.tableNumber = null;
      state.orders = [];
      state.totalAmount = 0;
    },
  },
});

export const { setTableOrder, clearTableOrder } = tableOrderSlice.actions;

export default tableOrderSlice.reducer;
