"use client";

import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { resendVerifyEmailOtp, verifyEmail } from "@/api-services/auth.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { parseError } from "@/api-services/utils/parseError";

export default function OtpVerification() {
  const navigate = useNavigate();
  const [SearchParams] = useSearchParams();
  const email = SearchParams.get("email");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(30);

  // Cool-down timer for resending OTP
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      await verifyEmail({ otp, email: email || "" });
      toast.success("OTP Verified Successfully!");
      navigate("/login");
    } catch (err: any) {
      const message = parseError(err);
      toast.error(message || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    setMessage("");

    try {
      await resendVerifyEmailOtp({ email: email || "" });
      setMessage("A new OTP has been sent to your email.");
      setCooldown(30); // reset cooldown
    } catch (err: any) {
      setError("Failed to resend OTP. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="animate-fadeIn w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        {/* Title */}
        <h2 className="mb-4 text-center text-3xl font-extrabold text-blue-700">
          Verify OTP
        </h2>
        <p className="mb-6 text-center text-gray-600">
          Enter the 6-digit code sent to your email address.
        </p>

        {/* Alerts */}
        {error && (
          <div className="mb-3 rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-3 rounded-lg border border-green-300 bg-green-100 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
              className="w-full rounded-xl border px-4 py-3 text-center text-xl font-semibold tracking-widest transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••"
            />
          </div>

          {/* VERIFY BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-lg font-semibold text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        {/* RESEND OTP */}
        <div className="mt-6 text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend available in{" "}
              <span className="font-semibold">{cooldown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="flex items-center justify-center gap-2 font-semibold text-blue-600 hover:underline"
            >
              {resendLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
