import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  iat?: number;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, email: string, accountType: string) => void;
  logout: () => void;
  saveProfile: (profile: unknown) => void;
  email: string;
  token: string;
  accountType: string;
  isProvider: boolean;
  isClient: boolean;
  loading: boolean;
}

// Default functions to avoid undefined references
const noop = () => {};

const defaultAuthContext: AuthContextType = {
  isAuthenticated: true,
  login: noop,
  logout: noop,
  saveProfile: noop,
  email: "",
  token: "",
  accountType: "",
  isProvider: false,
  isClient: false,
  loading: true,
};

// Create the context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Custom hook for easy context access
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

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [accountType, setAccountType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isProvider = accountType === "Service Provider";
  const isClient = accountType === "Client";

  // 🔄 Restore session from localStorage on app load
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
            const parsedUser = storedUser ? JSON.parse(storedUser) : {};
            setToken(storedToken);
            setEmail(storedEmail);
            setAccountType(parsedUser?.type || decoded.role || "");
            setIsAuthenticated(true);
          } else {
            console.warn("Token expired, clearing session.");
            localStorage.clear();
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.clear();
        }
      }

      setLoading(false); // ✅ End loading state
    };

    restoreSession();
  }, []);

  // 🔐 Handle login
  const login = (accessToken: string, email: string, accountType: string) => {
    setToken(accessToken);
    setEmail(email);
    setAccountType(accountType);
    setIsAuthenticated(true);

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_saved", JSON.stringify({ type: accountType }));
  };

  // 💾 Save profile
  const saveProfile = (profile: unknown) => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
  };

  // 🚪 Logout
  const logout = () => {
    setToken("");
    setEmail("");
    setAccountType("");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
