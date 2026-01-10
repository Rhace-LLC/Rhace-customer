import RhaceLogo from "../../assets/Rhace-10.png";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/api-services/auth.service";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export interface FormErrors {
  [key: string]: string;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [step, setStep] = useState<"otp" | "reset">("otp");
  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep = () => {
    const errors: FormErrors = {};
    if (step === "otp") {
      if (!form.otp.trim()) errors.otp = "OTP is required";
      if (form.otp && form.otp.length !== 6) errors.otp = "Enter 6-digit OTP";
    } else {
      if (!form.password.trim()) errors.password = "Password is required";
      if (!form.confirm_password.trim())
        errors.confirm_password = "Confirm your password";
      if (form.password !== form.confirm_password)
        errors.confirm_password = "Passwords do not match";
    }
    return { valid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { valid, errors } = validateStep();
    setErrors(errors);
    if (!valid) {
      Object.values(errors).forEach((err) => toast.error(err));
      return;
    }

    try {
      setLoading(true);
      if (step === "otp") {
        await new Promise((res) => setTimeout(res, 1200));
        toast.success("OTP verified!");
        setStep("reset");
      } else {
        const payload = {
          email,
          otp: form.otp,
          new_password: form.password,
          confirm_password: form.password,
        };
        const response = await resetPassword(payload);
        toast.success(response?.message || "Password reset successful!");
        navigate("/login");
      }
    } catch {
      toast.error("Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* FORM SECTION */}
      <div className="flex min-h-screen flex-col justify-center px-6 py-8">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <img
              src={RhaceLogo}
              alt="Rhace Logo"
              className="mx-auto w-[70px]"
            />
          </div>

          {/* Heading */}
          <div className="space-y-2 text-center">
            <h3 className="text-3xl font-bold tracking-tighter text-gray-900">
              {step === "otp" ? "Enter Reset OTP" : "Reset Password"}
            </h3>
            <p className="text-sm text-gray-500">
              {step === "otp"
                ? `Enter the 6-digit OTP sent to ${email}`
                : "Set a new password for your account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === "otp" ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={(e) =>
                    setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })
                  }
                  placeholder="••••••"
                  maxLength={6}
                  className="h-14 w-full rounded-sm bg-gray-100 text-center text-2xl font-semibold tracking-[0.3em] transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.otp && (
                  <p className="text-center text-sm text-red-500">
                    {errors.otp}
                  </p>
                )}
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
                    "Verify OTP"
                  )}
                </button>
              </div>
            ) : (
              <>
                {/* Password */}
                <div className="relative space-y-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="h-12 w-full rounded-sm bg-gray-100 px-4 text-gray-900 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative space-y-2">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    placeholder="********"
                    className="h-12 w-full rounded-sm bg-gray-100 px-4 text-gray-900 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  {errors.confirm_password && (
                    <p className="text-sm text-red-500">
                      {errors.confirm_password}
                    </p>
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
                    "Reset Password"
                  )}
                </button>
              </>
            )}
          </form>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-600">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </p>

          {/* Footer */}
          <footer>
            <p className="mt-8 text-center text-sm text-gray-500">
              &copy; Rhace {new Date().getFullYear()}
            </p>
          </footer>
        </div>
      </div>

      {/* IMAGE SECTION */}
      <div className="relative hidden md:flex">
        <img
          src="https://res.cloudinary.com/mixam/image/upload/v1767798994/jwhqnhiqa5fpnkf0hu7f.png"
          alt="Reset password illustration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full flex-col justify-center p-10 text-white">
          <h2 className="text-2xl font-normal tracking-tight">
            Secure your account
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Reset your password safely and continue enjoying your account.
          </p>
        </div>
      </div>
    </div>
  );
}
