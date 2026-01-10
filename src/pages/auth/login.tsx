import { Link, useNavigate, useSearchParams } from "react-router-dom";
import RhaceLogo from "../../assets/Rhace-10.png";
import { useState } from "react";

import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

import { toast } from "sonner";
import {
  login,
  LoginRequestBody,
  resendVerifyEmailOtp,
} from "@/api-services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { parseError } from "@/api-services/utils/parseError";

import imageSvg from "../../assets/login-img-svg.svg";
const loginImg =
  "https://res.cloudinary.com/mixam/image/upload/v1767798994/jwhqnhiqa5fpnkf0hu7f.png";

export interface FormErrors {
  [key: string]: string;
}
export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [SearchParams] = useSearchParams();
  const next = SearchParams.get("next");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  // -------------------- VALIDATOR --------------------
  const validateForm = () => {
    const errors: FormErrors = {};

    if (!form.email.trim()) errors.email = "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      errors.email = "Invalid email address";
    }

    if ((form.password && form.password.length < 6) || !form.password) {
      errors.password =
        "Password must be at least 6 characters, include one uppercase letter and one number";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { valid, errors } = validateForm();
    setErrors(errors);

    if (!valid) {
      return;
    }

    try {
      setLoading(true);

      const payload: LoginRequestBody = {
        email: form.email,
        password: form.password,
      };

      const response = await login(payload); // Await API call

      auth.login(response);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Login successful!");
      if (next) {
        navigate(`/${next}`);
      }
    } catch (error) {
      const message = parseError(error);
      toast.error(message || "Failed to login. Please try again.");

      if (message == "Please verify your email before logging in") {
        navigate(`/verify-email?email=${form.email}`);
        resendVerifyEmailOtp({ email: form.email });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr] md:grid-cols-2 md:grid-rows-1">
      {/* SECTION 1 — FORM */}
      <div className="flex min-h-screen flex-col justify-between space-y-8 px-4 py-4">
        <div className="header flex justify-between">
          <div className="text-center">
            <img
              src={RhaceLogo}
              alt="Rhace Logo"
              className="mx-auto w-[70px]"
            />
          </div>
          <div className="hidden">
            Home <ArrowRight className="inline h-4 w-4" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <h3 className="text-3xl font-bold tracking-tighter text-gray-900">
              Hi, Welcome Back
            </h3>

            <p className="text-sm leading-relaxed text-gray-500">
              Connecting you to the best dining experience. Please input your
              login credentials to continue.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium tracking-tight text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onFocus={() => setErrors({})}
                  className="h-12 w-full rounded-sm bg-gray-100 px-5 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium tracking-tight text-gray-700">
                    Password
                  </label>
                  <p className="cursor-pointer text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
                    <Link to={"/forgot-password"}>Forgot Password?</Link>
                  </p>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onFocus={() => setErrors({})}
                  className="h-12 w-full rounded-sm bg-gray-100 px-5 pr-12 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[40px] right-4 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`flex h-12 w-full items-center justify-center rounded-md bg-black font-medium tracking-tight text-white shadow-sm transition-all duration-200 hover:bg-gray-900 hover:shadow-md active:scale-[0.98] ${loading ? "cursor-not-allowed opacity-60 hover:bg-black hover:shadow-sm" : ""} `}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Login"
                )}
              </button>

              <p className="mt-4 text-center text-sm text-gray-700">
                Are you new to the platform ?{" "}
                <span className="text-gray-700">If you are, then</span>{" "}
                <Link to={"/signup"}>
                  <span className="font-medium text-blue-600">
                    sign up for an awesome experience
                  </span>
                </Link>
              </p>
            </div>
          </form>
        </div>

        <footer>
          <p className="text-center text-sm leading-relaxed text-gray-500">
            &copy; Copyright Rhace {new Date().getFullYear()}
          </p>
        </footer>
      </div>

      {/* SECTION 2 — IMAGE */}
      <section className="relative min-h-screen md:flex">
        <img
          src={loginImg}
          alt="Dining experience"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Optional text overlay */}
        <div className="relative z-10 flex h-full flex-col items-start p-10">
          <div className="header flex w-full justify-between">
            <p className="max-w-[300px] text-sm leading-relaxed text-gray-500">
              Where great dining begins
            </p>

            <div>
              <ArrowRight className="inline h-4 w-4 text-white" />
            </div>
          </div>
          <div className="py-10">
            <img src={imageSvg} className="w-[80px]" />
          </div>
          <div className="max-w-md space-y-2 text-white">
            <h2 className="text-2xl font-normal tracking-tight">
              “From trusted restaurants to seamless ordering and management —
              everything you need in one place.”
            </h2>
            <p className="text-sm text-white/80">
              Discover restaurants you’ll love and experiences you’ll remember.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
