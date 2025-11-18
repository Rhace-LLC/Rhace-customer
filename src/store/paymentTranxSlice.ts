import { Payment } from "@/api-services/payments.service";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export function uniqueBy<T, K extends keyof T>(items: T[], key: K): T[] {
  const seen = new Set<T[K]>();
  return items.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

interface PaymentState {
  data: Record<string, Payment[]>;
  total: number;
}

const initialState: PaymentState = {
  data: {},
  total: 0,
};

const PaymentSlice = createSlice({
  name: "Payment",
  initialState,
  reducers: {
    appendTransactionToPage: (
      state,
      action: PayloadAction<{ key: string; item: Payment }>
    ) => {
      const { key, item } = action.payload;
      const current = state.data[key] || [];

      const updated = [item, ...current.filter((d) => d.id !== item.id)];
      state.data[key] = updated;
    },

    updateTransactionData: (
      state,
      action: PayloadAction<{ key: string; data: Payment[] }>
    ) => {
      const { key, data } = action.payload;
      state.data[key] = uniqueBy([...(state.data[key] || []), ...data], "id");
    },

    updateTransactionDataById: (state, action: PayloadAction<Payment>) => {
      Object.keys(state.data).forEach((key) => {
        state.data[key] = state.data[key].map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      });
    },

    removeTransactionDataById: (state, action: PayloadAction<string>) => {
      Object.keys(state.data).forEach((key) => {
        state.data[key] = state.data[key].filter(
          (item) => item.id !== action.payload
        );
      });
    },

    updateTransactionTotal: (
      state,
      action: PayloadAction<{ total: number }>
    ) => {
      state.total = action.payload.total;
    },

    clearTransactionData: (state) => {
      state.data = {};
      state.total = 0;
    },
  },
});

export const {
  appendTransactionToPage,
  updateTransactionData,
  updateTransactionDataById,
  removeTransactionDataById,
  updateTransactionTotal,
  clearTransactionData,
} = PaymentSlice.actions;

export default PaymentSlice.reducer;
