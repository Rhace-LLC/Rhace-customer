import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RhaceLogo from "../../assets/Rhace-10.png";
import { requestPasswordReset } from "@/api-services/auth.service";
import { ArrowRight, Loader2 } from "lucide-react";

export interface FormErrors {
  [key: string]: string;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!form.email.trim()) errors.email = "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email))
      errors.email = "Invalid email address";

    return { valid: Object.keys(errors).length === 0, errors };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { valid, errors } = validateForm();
    setErrors(errors);
    if (!valid) {
      Object.values(errors).forEach((err) => toast.error(err));
      return;
    }

    try {
      setLoading(true);
      const response = await requestPasswordReset(form.email);
      toast.success(response?.message || "Password reset link sent!");
      navigate(`/resetpassword?email=${form.email}`);
    } catch (err) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen">
      {/* FORM SECTION */}
      <div className="flex min-h-screen flex-col justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex justify-between">
          <img src={RhaceLogo} alt="Rhace Logo" className="w-[70px]" />
          <ArrowRight className="inline h-4 w-4" />
        </div>
        <div className="space-y-8">
          {/* Heading */}
          <div className="space-y-2 text-center">
            <h3 className="text-3xl font-bold tracking-tighter text-gray-900">
              Forgot Password
            </h3>
            <p className="text-sm text-gray-500">
              Enter your email to receive a reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium tracking-tight text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="h-12 w-full rounded-sm bg-gray-100 px-4 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex h-12 w-full items-center justify-center rounded-md bg-black font-medium tracking-tight text-white shadow-sm transition-all duration-200 hover:bg-gray-900 ${
                loading ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-600">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
        {/* Footer */}
        <footer>
          <p className="mt-8 text-center text-sm text-gray-500">
            &copy; Rhace {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
