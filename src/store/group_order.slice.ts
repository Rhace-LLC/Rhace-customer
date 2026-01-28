import { BillOrder } from "@/api-services/billsettlement.service";
import { DiningGroup } from "@/api-services/dininggroup.service";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GroupOrderState {
  group: DiningGroup | null;
}

const initialState: GroupOrderState = {
  group: null,
};

const groupOrderSlice = createSlice({
  name: "GroupOrder",
  initialState,
  reducers: {
    setGroupOrder(
      state,
      action: PayloadAction<{
        group: DiningGroup;
      }>
    ) {
      state.group = action.payload.group;
    },

    /**
     * Update only the orders inside the current dining group
     */
    updateDiningGroupOrders(
      state,
      action: PayloadAction<BillOrder[]>
    ) {
      if (!state.group) return;

      state.group.orders = action.payload;
    },

    clearGroupOrder(state) {
      state.group = null;
    },
  },
});

export const { setGroupOrder, clearGroupOrder, updateDiningGroupOrders } = groupOrderSlice.actions;

export default groupOrderSlice.reducer;
