import { Link, useNavigate } from "react-router-dom";
import RhaceLogo from "../../assets/Rhace-10.png";
import { useState } from "react";

import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { register, RegisterRequestBody } from "@/api-services/auth.service";

import imageSvg from "../../assets/login-img-svg.svg";
const loginImg =
  "https://res.cloudinary.com/mixam/image/upload/v1767798994/jwhqnhiqa5fpnkf0hu7f.png";
export interface FormErrors {
  [key: string]: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // -------------------- VALIDATION --------------------
  const validateForm = () => {
    const errors: FormErrors = {};

    if (!form.first_name.trim()) errors.first_name = "First name is required";
    if (!form.last_name.trim()) errors.last_name = "Last name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      // Validate phone format
      const phoneRegex = /^[0-9+]{7,15}$/;
      if (!phoneRegex.test(form.phone)) {
        errors.phone = "Invalid phone number";
      }
    }

    if (!form.password.trim()) errors.password = "Password is required";
    if (!form.confirm_password.trim())
      errors.confirm_password = "Confirm password is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      errors.email = "Invalid email address";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (form.password && !passwordRegex.test(form.password)) {
      errors.password =
        "Password must be at least 6 characters, include one uppercase letter and one number";
    }

    if (
      form.password &&
      form.confirm_password &&
      form.password !== form.confirm_password
    ) {
      errors.confirm_password = "Passwords do not match the one above";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  };

  // -------------------- HANDLERS --------------------
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

      const payload: RegisterRequestBody = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirm_password: form.password,
        role: "customer",
      };

      await register(payload); // ✅ API call
      toast.success("Account created successfully!");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (error: any) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- RENDER --------------------
  return (
    <>
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
                Create Your Account
              </h3>

              <p className="text-sm leading-relaxed text-gray-500">
                Connecting you to the best dining experience. Please input your
                login credentials to continue.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-5">
                {/* OWNER FIRST + LAST NAME */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium tracking-tight text-gray-700">
                      First Name
                    </label>
                    <input
                      name="first_name"
                      onFocus={() => setErrors({})}
                      className="h-12 w-full rounded-sm bg-gray-100 px-5 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={form.first_name}
                      onChange={handleChange}
                    />
                    {errors.first_name && (
                      <p className="text-sm text-red-500">
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium tracking-tight text-gray-700">
                      Last Name
                    </label>
                    <input
                      className="h-12 w-full rounded-sm bg-gray-100 px-5 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={form.last_name}
                      onFocus={() => setErrors({})}
                      name="last_name"
                      onChange={handleChange}
                    />
                    {errors.last_name && (
                      <p className="text-sm text-red-500">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                {/* OWNER EMAIL + PHONE */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium tracking-tight text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="h-12 w-full rounded-sm bg-gray-100 px-5 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={form.email}
                      onFocus={() => setErrors({})}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium tracking-tight text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="h-12 w-full rounded-sm bg-gray-100 px-5 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={form.phone}
                      onFocus={() => setErrors({})}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="relative space-y-2">
                  <label className="text-sm font-medium tracking-tight text-gray-700">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="h-12 w-full rounded-sm bg-gray-100 px-5 pr-12 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={form.password}
                    onFocus={() => setErrors({})}
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

                {/* CONFIRM PASSWORD */}
                <div className="relative space-y-2">
                  <label className="text-sm font-medium tracking-tight text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    onFocus={() => setErrors({})}
                    className="h-12 w-full rounded-sm bg-gray-100 px-5 pr-12 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={form.confirm_password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-[40px] right-4 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
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
                  className={`flex h-12 w-full items-center justify-center rounded-md bg-black font-medium tracking-tight text-white shadow-sm transition-all duration-200 hover:bg-gray-900 hover:shadow-md active:scale-[0.98] ${loading ? "cursor-not-allowed opacity-60 hover:bg-black hover:shadow-sm" : ""} `}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>

                <p className="mt-4 text-center text-sm text-gray-700">
                  Already have an account?{" "}
                  <Link to={"/login"}>
                    <span className="font-medium text-blue-600">
                      Login Here
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
                Discover restaurants you’ll love and experiences you’ll
                remember.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
