// src/store/groupBill.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bill } from "@/api-services/billsettlement.service";

interface GroupBillState {
  bill: Bill | null;
}

const initialState: GroupBillState = {
  bill: null,
};

const groupBillSlice = createSlice({
  name: "groupBill",
  initialState,
  reducers: {
    setBill(state, action: PayloadAction<Bill>) {
      state.bill = action.payload;
    },
    clearBill(state) {
      state.bill = null;
    },
  },
});

export const { setBill, clearBill } = groupBillSlice.actions;
export default groupBillSlice.reducer;
