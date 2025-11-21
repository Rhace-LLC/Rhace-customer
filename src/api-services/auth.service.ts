// src/services/auth.service.ts

import { getConfig } from "./utils/reqConfig";
import { bookiesAxiosInstance } from "./utils/baseUrl";

// ---------------------------
// 📘 Interfaces
// ---------------------------

// ------------------ USER ROLE TYPE ------------------
export type UserRole =
  | "admin"
  | "restaurant_owner"
  | "waiter"
  | "kitchen"
  | "inventory_mgr"
  | "driver"
  | "customer"
  | "unassigned";

export interface LoginResponse {
  tokens: {
    refresh: string;
    access: string;
  };
  role: UserRole;
  user: UserDataLogin;
}

export interface UserDataLogin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LogoutRequestBody {
  refresh: string;
}

export interface RegisterRequestBody {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  confirm_password: string;
  role: string;
}

// New interfaces for added endpoints
export interface VerifyEmailBody {
  email: string;
  otp: string;
}

export interface ResendVerifyOtpBody {
  email: string;
}

// ---------------------------
// 📘 Auth Service Functions
// ---------------------------

// Login
const login = async (data: LoginRequestBody): Promise<LoginResponse> => {
  const config = getConfig(`/auth/login/`, "POST", undefined, data);
  return bookiesAxiosInstance(config);
};

// Logout
const logout = async (data: LogoutRequestBody): Promise<any> => {
  const config = getConfig(`/auth/logout/`, "POST", undefined, data);
  return bookiesAxiosInstance(config);
};

// Request password reset
const requestPasswordReset = async (email: string): Promise<any> => {
  const config = getConfig(`/auth/password-reset/request/`, "POST", undefined, {
    email,
  });
  return bookiesAxiosInstance(config);
};

// Verify password reset token
const verifyPasswordReset = async (data: Record<string, any>): Promise<any> => {
  const config = getConfig(
    `/auth/password-reset/verify/`,
    "POST",
    undefined,
    data
  );
  return bookiesAxiosInstance(config);
};

// Reset password
const resetPassword = async (data: Record<string, any>): Promise<any> => {
  const config = getConfig(
    `/auth/password-reset/reset/`,
    "POST",
    undefined,
    data
  );
  return bookiesAxiosInstance(config);
};

// Register
const register = async (data: RegisterRequestBody): Promise<any> => {
  const config = getConfig(`/auth/register/`, "POST", undefined, data);
  return bookiesAxiosInstance(config);
};

// ---------------------------
// ⭐ NEW ENDPOINTS
// ---------------------------

// POST /auth/verify/email/
const verifyEmail = async (data: VerifyEmailBody): Promise<any> => {
  const config = getConfig(`/auth/verify/email/`, "POST", undefined, data);
  return bookiesAxiosInstance(config);
};

// POST /auth/resend/verify-email/otp/
const resendVerifyEmailOtp = async (
  data: ResendVerifyOtpBody
): Promise<any> => {
  const config = getConfig(
    `/auth/resend/verify-email/otp/`,
    "POST",
    undefined,
    data
  );
  return bookiesAxiosInstance(config);
};

// ---------------------------
// 📘 Export All
// ---------------------------

// ---------------------------
// 📘 Export All
// ---------------------------

// ----- Profile Response -----
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  role: "admin" | "customer" | "restaurant"; // adjust if needed
  restaurant: string | null;
  restaurant_name: string | null;
  is_verified: boolean;
  is_active: boolean;
}

// ----- Update Profile Body (PUT / PATCH) -----
export interface UpdateProfileBody {
  first_name?: string;
  last_name?: string;
  phone?: string;
  restaurant?: string | null;
}

// ----- Change Password Body -----
export interface ChangePasswordBody {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * ============================
 * Service Functions
 * ============================
 */

// 🔹 GET /auth/profile/
export const getProfile = async (token: string): Promise<UserProfile> => {
  const config = getConfig(`/auth/profile/`, "GET", token);
  return bookiesAxiosInstance(config);
};

// 🔹 PUT /auth/profile/
export const updateProfile = async (
  token: string,
  data: UpdateProfileBody
): Promise<{ message: string; data: UserProfile }> => {
  const config = getConfig(`/auth/profile/`, "PUT", token, data);
  return bookiesAxiosInstance(config);
};

// 🔹 PATCH /auth/profile/
export const patchProfile = async (
  token: string,
  data: UpdateProfileBody
): Promise<UserProfile> => {
  const config = getConfig(`/auth/profile/`, "PATCH", token, data);
  return bookiesAxiosInstance(config);
};

// 🔹 PUT /auth/profile/change-password/
export const changePassword = async (
  token: string,
  data: ChangePasswordBody
): Promise<any> => {
  const config = getConfig(
    `/auth/profile/change-password/`,
    "PUT",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

// 🔹 PATCH /auth/profile/change-password/
export const patchPassword = async (
  token: string,
  data: ChangePasswordBody
): Promise<any> => {
  const config = getConfig(
    `/auth/profile/change-password/`,
    "PATCH",
    token,
    data
  );
  return bookiesAxiosInstance(config);
};

export {
  login,
  logout,
  requestPasswordReset,
  verifyPasswordReset,
  resetPassword,
  register,
  verifyEmail,
  resendVerifyEmailOtp,
};
