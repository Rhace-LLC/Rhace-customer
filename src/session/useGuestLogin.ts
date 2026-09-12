import { useState } from "react";
import {
  guestLogin,
  type GuestLoginResponse,
} from "@/api-services/auth.service";
import { parseError } from "@/api-services/utils/parseError";

export interface GuestNameInput {
  first_name: string;
  last_name: string;
  phone?: string;
}

const buildGuestEmail = () => {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `guest_${suffix}@guest.rhace.local`;
};

export const useGuestLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (name: GuestNameInput): Promise<GuestLoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await guestLogin({
        first_name: name.first_name.trim(),
        last_name: name.last_name.trim(),
        phone: name.phone?.trim() ?? "",
        email: buildGuestEmail(),
      });
    } catch (err) {
      setError(parseError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
