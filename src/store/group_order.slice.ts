import { DiningGroup } from "@/api-services/dininggroup.service";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GroupOrderState {
  group: DiningGroup | null;

  // Derived / UI state
  totalAmount: number;
}

const initialState: GroupOrderState = {
  group: null,
  totalAmount: 0,
};

const groupOrderSlice = createSlice({
  name: "GroupOrder",
  initialState,
  reducers: {
    setGroupOrder(
      state,
      action: PayloadAction<{
        group: DiningGroup;
        totalAmount: number;
      }>
    ) {
      state.group = action.payload.group;
      state.totalAmount = action.payload.totalAmount;
    },

    clearGroupOrder(state) {
      state.group = null;
      state.totalAmount = 0;
    },
  },
});

export const { setGroupOrder, clearGroupOrder } = groupOrderSlice.actions;

export default groupOrderSlice.reducer;
