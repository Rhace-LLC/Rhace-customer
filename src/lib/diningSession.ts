/**
 * Persists the guest's table session across page refreshes: which table they
 * scanned, how they chose to dine, and their unsubmitted cart. Entries expire
 * after a dining-length window so yesterday's table is never reused. Logout
 * calls `localStorage.clear()`, which also wipes these.
 */

const SESSION_KEY = "rhace.dining_session";
const CART_KEY = "rhace.cart";
/** Long enough for one meal or night out, short enough to never leak into the next visit. */
const TTL_MS = 12 * 60 * 60 * 1000;

export interface StoredSelection {
  tableId: string;
  restaurantId: string;
  restaurantName: string;
  tableNo: string;
}

export interface StoredDiningSession {
  selection: StoredSelection | null;
  preference: "personal" | "group" | null;
}

interface Stamped<T> {
  savedAt: number;
  value: T;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stamped<T>;
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    /* storage full or blocked (private mode): the session just won't survive a refresh */
  }
}

export const loadDiningSession = () => read<StoredDiningSession>(SESSION_KEY);
export const saveDiningSession = (session: StoredDiningSession | null) =>
  write(SESSION_KEY, session);

export const loadCart = <T>() => read<T>(CART_KEY);
export const saveCart = <T>(cart: T | null) => write(CART_KEY, cart);
