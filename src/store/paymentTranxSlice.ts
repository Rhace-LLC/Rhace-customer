import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ---------------- Helper ----------------
export function uniqueBy<T, K extends keyof T>(items: T[], key: K): T[] {
  const seen = new Set<T[K]>();
  return items.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

// ---------------- Types ----------------
export interface PaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string; // e.g., card, wallet, bank
  status: string; // pending | completed | failed
  reference: string;
  created: string;
  updated: string;
}

// State type
interface PaymentTransactionState {
  data: Record<string, PaymentTransaction[]>; // grouped or paginated by key
  total: number; // for pagination
}

// ---------------- Initial State ----------------
const initialState: PaymentTransactionState = {
  data: {},
  total: 0,
};

// ---------------- Slice ----------------
const PaymentTransactionSlice = createSlice({
  name: "PaymentTransaction",
  initialState,
  reducers: {
    // Add or update a transaction in a specific page/group
    appendTransactionToPage: (
      state,
      action: PayloadAction<{ key: string; item: PaymentTransaction }>
    ) => {
      const { key, item } = action.payload;
      const current = state.data[key] || [];

      const updated = [item, ...current.filter((d) => d.id !== item.id)];
      state.data[key] = updated;
    },

    // Add or update multiple transactions in a page/group
    updateTransactionData: (
      state,
      action: PayloadAction<{ key: string; data: PaymentTransaction[] }>
    ) => {
      const { key, data } = action.payload;
      state.data[key] = uniqueBy([...(state.data[key] || []), ...data], "id");
    },

    // Update a transaction across all groups by ID
    updateTransactionDataById: (
      state,
      action: PayloadAction<PaymentTransaction>
    ) => {
      Object.keys(state.data).forEach((key) => {
        state.data[key] = state.data[key].map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      });
    },

    // Remove a transaction by ID across all groups
    removeTransactionDataById: (state, action: PayloadAction<string>) => {
      Object.keys(state.data).forEach((key) => {
        state.data[key] = state.data[key].filter(
          (item) => item.id !== action.payload
        );
      });
    },

    // Update total count
    updateTransactionTotal: (
      state,
      action: PayloadAction<{ total: number }>
    ) => {
      state.total = action.payload.total;
    },

    // Reset all transaction data
    clearTransactionData: (state) => {
      state.data = {};
      state.total = 0;
    },
  },
});

// ---------------- Exports ----------------
export const {
  appendTransactionToPage,
  updateTransactionData,
  updateTransactionDataById,
  removeTransactionDataById,
  updateTransactionTotal,
  clearTransactionData,
} = PaymentTransactionSlice.actions;

export default PaymentTransactionSlice.reducer;
