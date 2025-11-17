"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { LoginResponse } from "@/api-services/auth.service";

interface DecodedToken {
  exp: number;
  iat?: number;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (response: LoginResponse) => void;
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
  login: noop,
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [accountType, setAccountType] = useState("");
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isProvider = accountType === "Service Provider";
  const isClient = accountType === "Client";

  // Restore session
  useEffect(() => {
    const restoreSession = () => {
      const storedToken = localStorage.getItem("access_token");
      const storedEmail = localStorage.getItem("user_email");
      const storedUser = localStorage.getItem("user_saved");

      if (storedToken && storedEmail) {
        try {
          const decoded = jwtDecode<DecodedToken>(storedToken);
          const tokenStatus = tokenExpiresIn(decoded.exp);

          if (!tokenStatus.expired) {
            setToken(storedToken);
            setEmail(storedEmail);

            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            setUser(parsedUser);

            setAccountType(parsedUser?.type || decoded.role || "");
            setIsAuthenticated(true);
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
    setToken(response.tokens.access);
    setEmail(response.user.email);
    setAccountType(response.role);
    setUser(response.user);
    setIsAuthenticated(true);

    localStorage.setItem("access_token", response.tokens.access);
    localStorage.setItem("user_email", response.user.email);
    localStorage.setItem("user_saved", JSON.stringify(response.user));
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
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
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
