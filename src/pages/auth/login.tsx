import { Link } from "react-router-dom";
import RhaceLogo from "../../assets/Rhace-10.png";
import { useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { login, LoginRequestBody } from "@/api-services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

export interface FormErrors {
  [key: string]: string;
}
export default function Login() {
  const auth = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { setLoading, setLoadingText } = useLoading();

  const [errors, setErrors] = useState<FormErrors>({});
  // -------------------- VALIDATOR --------------------
  const validateForm = () => {
    const errors: FormErrors = {};

    if (!form.email.trim()) errors.email = "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      errors.email = "Invalid email address";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (form.password && !passwordRegex.test(form.password)) {
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
      Object.values(errors).forEach((err) => toast.error(err));
      return;
    }

    if (!form.email || !form.password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoadingText("Logging in...");
      setLoading(true);

      const payload: LoginRequestBody = {
        email: form.email,
        password: form.password,
      };
      const response = await login(payload); // Await API call

      auth.login(response.tokens.access, form.email, response.role);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Login successful!");
    } catch (error) {
      toast.error("Failed to login. Please try again.");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4">
      {/* Background Bubbles */}
      {/* Login Box */}
      <div className="relative z-10 w-full max-w-lg space-y-10 rounded-[10px] bg-transparent p-8 py-[100px] bg-blend-soft-light shadow-sm">
        <div className="text-center">
          <img src={RhaceLogo} alt="Rhace Logo" className="mx-auto w-[150px]" />
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-bold tracking-tight text-gray-800">
            Welcome Back,
          </h3>
          <p className="mt-2 font-medium text-gray-500">
            Login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            {errors.email && (
              <small className="text-red-500">{errors.email}</small>
            )}
          </div>

          <div className="relative space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            {errors.password && (
              <small className="text-red-500">{errors.password}</small>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full rounded-[10px] bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
