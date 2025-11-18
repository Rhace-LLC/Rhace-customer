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

// Reservation interface (based on typical reservation structure)
export interface Reservation {
  id: string;
  customer_name: string;
  customer_phone: string;
  party_size: number;
  date: string; // ISO datetime
  time: string; // "HH:mm"
  status: string; // pending | confirmed | cancelled | completed
  table_id: string | null;
  restaurant: string;
  notes?: string;
  created: string;
  updated: string;
}

// Summary counts for dashboard
export interface ReservationSummary {
  total_pending: number;
  total_confirmed: number;
  total_cancelled: number;
  total_completed: number;
  total_reservations: number;
}

interface ReservationState {
  data: Record<string, Reservation[]>; // grouped or paginated by key
  summary: ReservationSummary;
  data_total: number;
}

// ---------------- Initial State ----------------
const initialState: ReservationState = {
  data: {},
  summary: {
    total_pending: 0,
    total_confirmed: 0,
    total_cancelled: 0,
    total_completed: 0,
    total_reservations: 0,
  },
  data_total: 0,
};

// ---------------- Slice ----------------
const ReservationSlice = createSlice({
  name: "Reservation",
  initialState,
  reducers: {
    // Add or update a reservation in a specific page/group
    appendReservationToPage: (
      state,
      action: PayloadAction<{ key: string; item: Reservation }>
    ) => {
      const { key, item } = action.payload;
      const current = state.data[key] || [];

      const updated = [item, ...current.filter((d) => d.id !== item.id)];
      state.data[key] = updated;
    },

    updateReservationData: (
      state,
      action: PayloadAction<{ key: string; data: Reservation[] }>
    ) => {
      const { key, data } = action.payload;
      state.data[key] = uniqueBy([...(state.data[key] || []), ...data], "id");
    },

    // Update a reservation across all groups
    updateReservationDataById: (state, action: PayloadAction<Reservation>) => {
      Object.keys(state.data).forEach((key) => {
        state.data[key] = state.data[key].map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      });
    },

    // Remove by ID across all groups
    removeReservationDataById: (state, action: PayloadAction<string>) => {
      Object.keys(state.data).forEach((key) => {
        state.data[key] = state.data[key].filter(
          (item) => item.id !== action.payload
        );
      });
    },

    // Update summary
    updateReservationSummary: (
      state,
      action: PayloadAction<ReservationSummary>
    ) => {
      state.summary = action.payload;
    },

    // Update total count
    updateReservationTotal: (
      state,
      action: PayloadAction<{ data_total: number }>
    ) => {
      state.data_total = action.payload.data_total;
    },

    // Reset everything
    clearReservationData: (state) => {
      state.data = {};
      state.summary = {
        total_pending: 0,
        total_confirmed: 0,
        total_cancelled: 0,
        total_completed: 0,
        total_reservations: 0,
      };
      state.data_total = 0;
    },
  },
});

// ---------------- Exports ----------------
export const {
  appendReservationToPage,
  updateReservationData,
  updateReservationDataById,
  removeReservationDataById,
  updateReservationSummary,
  updateReservationTotal,
  clearReservationData,
} = ReservationSlice.actions;

export default ReservationSlice.reducer;
