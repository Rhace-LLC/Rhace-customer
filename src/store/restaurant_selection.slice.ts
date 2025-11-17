// src/store/slices/selectionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectionState {
  tableId: string | null;
  restaurantId: string | null;
  restaurantName: string | null;
}

const initialState: SelectionState = {
  tableId: null,
  restaurantId: null,
  restaurantName: null,
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
      }>
    ) => {
      state.tableId = action.payload.tableId;
      state.restaurantId = action.payload.restaurantId;
      state.restaurantName = action.payload.restaurantName;
    },

    clearSelection: (state) => {
      state.tableId = null;
      state.restaurantId = null;
      state.restaurantName = null;
    },
  },
});

export const { setSelection, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
