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

export const useGuestLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (name: GuestNameInput): Promise<GuestLoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      // phone and email are generated per-call inside the request layer.
      return await guestLogin({
        first_name: name.first_name.trim(),
        last_name: name.last_name.trim(),
        phone: name.phone?.trim() ?? "",
        email: "",
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
