import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FullScreenLoader } from "@/pages/orders/components/utils";
import { GuestWelcomeDialog } from "./GuestWelcomeDialog";

const AUTH_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/resetpassword",
  "/verify-email",
];

const PUBLIC_PREFIXES = ["/view-restaurant/"];

/**
 * Decides what an anonymous visitor sees on first load:
 *  - session still restoring  -> full-screen loader
 *  - authenticated (user/guest) -> the app
 *  - on a public/auth page     -> the app (e.g. the login form)
 *  - anywhere else             -> the blocking guest welcome dialog
 */
export function SessionGate({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const { pathname } = useLocation();

  if (auth.loading) return <FullScreenLoader />;

  if (auth.isAuthenticated) return <>{children}</>;

  const isPublic =
    AUTH_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isPublic) return <>{children}</>;

  return <GuestWelcomeDialog />;
}
