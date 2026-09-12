"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  GuestLoginResponse,
  LoginResponse,
} from "@/api-services/auth.service";

interface DecodedToken {
  exp: number;
  iat?: number;
  role?: string;
  is_guest?: boolean;
  [key: string]: any;
}

export type SessionKind = "guest" | "user" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  isGuest: boolean;
  sessionKind: SessionKind;
  login: (response: LoginResponse) => void;
  guestLogin: (response: GuestLoginResponse) => void;
  logout: () => void;
  saveProfile: (profile: unknown) => void;
  email: string;
  token: string;
  accountType: string;
  isProvider: boolean;
  isClient: boolean;
  loading: boolean;
  user: LoginResponse["user"] | null;
}

// Default functions to avoid undefined references
const noop = () => {};

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  isGuest: false,
  sessionKind: null,
  login: noop,
  guestLogin: noop,
  logout: noop,
  saveProfile: noop,
  email: "",
  token: "",
  accountType: "",
  isProvider: false,
  isClient: false,
  loading: true,
  user: null,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);
export const useAuth = () => useContext(AuthContext);

interface TokenExpiryInfo {
  expired: boolean;
  hours: number;
  days: number;
}

const tokenExpiresIn = (exp: number): TokenExpiryInfo => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const oneDayInSeconds = 24 * 60 * 60;
  const adjustedExp = exp - oneDayInSeconds;
  const diffInSeconds = adjustedExp - nowInSeconds;

  if (diffInSeconds <= 0) {
    return { expired: true, hours: 0, days: 0 };
  }

  return {
    expired: false,
    hours: Math.floor(diffInSeconds / 3600),
    days: Math.floor(diffInSeconds / (3600 * 24)),
  };
};

interface PersistSessionInput {
  access: string;
  refresh?: string;
  user: LoginResponse["user"];
  role: string;
  isGuest: boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [accountType, setAccountType] = useState("");
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const isProvider = accountType === "Service Provider";
  const isClient = accountType === "Client";

  // Persist a resolved session (full account or guest) to state + storage.
  const persistSession = ({
    access,
    refresh,
    user: sessionUser,
    role,
    isGuest: guest,
  }: PersistSessionInput) => {
    setToken(access);
    setEmail(sessionUser.email ?? "");
    setAccountType(role);
    setUser(sessionUser);
    setIsAuthenticated(true);
    setIsGuest(guest);

    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user_email", sessionUser.email ?? "");
    localStorage.setItem("user_saved", JSON.stringify(sessionUser));
    localStorage.setItem("is_guest", String(guest));
  };

  // Restore session
  useEffect(() => {
    const restoreSession = () => {
      const storedToken = localStorage.getItem("access_token");
      const storedEmail = localStorage.getItem("user_email");
      const storedUser = localStorage.getItem("user_saved");
      const storedIsGuest = localStorage.getItem("is_guest");

      if (storedToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(storedToken);
          const tokenStatus = tokenExpiresIn(decoded.exp);

          if (!tokenStatus.expired) {
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            const guest =
              storedIsGuest === "true" ||
              parsedUser?.is_guest === true ||
              decoded.is_guest === true;

            setToken(storedToken);
            setEmail(parsedUser?.email || storedEmail || "");
            setUser(parsedUser);
            setAccountType(parsedUser?.type || decoded.role || "");
            setIsAuthenticated(true);
            setIsGuest(guest);
          } else {
            localStorage.clear();
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.clear();
        }
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  // Login
  const login = (response: LoginResponse) => {
    persistSession({
      access: response.tokens.access,
      refresh: response.tokens.refresh,
      user: response.user,
      role: response.role,
      isGuest: false,
    });
  };

  // Guest login
  const guestLogin = (response: GuestLoginResponse) => {
    persistSession({
      access: response.access,
      refresh: response.refresh,
      user: {
        id: response.user.id,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        email: "",
        is_guest: true,
      },
      role: "customer",
      isGuest: true,
    });
  };

  // Save profile
  const saveProfile = (profile: unknown) => {
    if (!profile) return;
    setUser(profile as LoginResponse["user"]);
    localStorage.setItem("user_saved", JSON.stringify(profile));
  };

  const logout = () => {
    setToken("");
    setEmail("");
    setAccountType("");
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    localStorage.clear();
  };

  const sessionKind: SessionKind = isAuthenticated
    ? isGuest
      ? "guest"
      : "user"
    : null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isGuest,
        sessionKind,
        login,
        guestLogin,
        logout,
        saveProfile,
        email,
        token,
        accountType,
        isProvider,
        isClient,
        loading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
