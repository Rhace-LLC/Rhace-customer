import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { resendVerifyEmailOtp, verifyEmail } from "@/api-services/auth.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { parseError } from "@/api-services/utils/parseError";

import RhaceLogo from "../../assets/Rhace-10.png";

export default function OtpVerification() {
  const navigate = useNavigate();
  const [SearchParams] = useSearchParams();
  const email = SearchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      await verifyEmail({ otp, email: email || "" });
      toast.success("Email verified successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(parseError(err) || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await resendVerifyEmailOtp({ email: email || "" });
      setMessage("A new OTP has been sent to your email.");
      setCooldown(30);
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen">
      {/* SECTION 1 — FORM */}
      <div className="w-max-[600px] mx-auto flex min-h-screen flex-col justify-between px-4 py-4">
        {/* Header */}
        <div className="w-max-[600px] flex justify-between">
          <img src={RhaceLogo} alt="Rhace Logo" className="w-[70px]" />
          <ArrowRight className="inline h-4 w-4" />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-center text-3xl font-bold tracking-tighter text-gray-900">
              Verify your email
            </h3>
            <p className="text-center text-sm leading-relaxed text-gray-500">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          {/* Alerts */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              className="h-14 w-full rounded-sm bg-gray-100 text-center text-2xl font-semibold tracking-[0.3em] focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className={`flex h-12 w-full items-center justify-center rounded-md bg-black font-medium tracking-tight text-white transition-all hover:bg-gray-900 ${
                loading ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="text-center text-sm text-gray-600">
            {cooldown > 0 ? (
              <p>
                Resend available in{" "}
                <span className="font-medium">{cooldown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="inline-flex items-center gap-2 font-medium text-blue-600 hover:underline"
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

        {/* Footer */}
        <footer>
          <p className="text-center text-sm text-gray-500">
            &copy; Rhace {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
