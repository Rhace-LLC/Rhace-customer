// src/store/slices/selectionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectionState {
  tableId: string | undefined;
  restaurantId: string | null;
  restaurantName: string | undefined;
  tableNo: string | undefined;
}

const initialState: SelectionState = {
  tableId: undefined,
  tableNo: undefined,
  restaurantId: null,
  restaurantName: undefined,
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    setSelection: (
      state,
      action: PayloadAction<{
        tableId: string;
        restaurantId: string;
        restaurantName: string;
        tableNo: string;
        access_code: string;
      }>
    ) => {
      state.tableId = action.payload.tableId;
      state.restaurantId = action.payload.restaurantId;
      state.restaurantName = action.payload.restaurantName;
      state.tableNo = action.payload.tableNo;
    },

    clearSelection: (state) => {
      state.tableId = undefined;
      state.restaurantId = null;
      state.restaurantName = undefined;
      state.tableNo = undefined;
    },
  },
});

export const { setSelection, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
