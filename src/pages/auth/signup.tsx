import { Link, useNavigate } from "react-router-dom";
import RhaceLogo from "../../assets/Rhace-10.png";
import { useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { register, RegisterRequestBody } from "@/api-services/auth.service";

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
  const { setLoading, setLoadingText } = useLoading();

  // -------------------- VALIDATION --------------------
  const validateForm = () => {
    const errors: FormErrors = {};

    if (!form.first_name.trim()) errors.first_name = "First name is required";
    if (!form.last_name.trim()) errors.last_name = "Last name is required";
    if (!form.email.trim()) errors.email = "Email is required";
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
      errors.confirm_password = "Passwords do not match";
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
      Object.values(errors).forEach((err) => toast.error(err));
      return;
    }

    try {
      setLoadingText("Creating your account...");
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
      setLoadingText("");
    }
  };

  // -------------------- RENDER --------------------
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4">
      <div className="relative z-10 w-full max-w-lg space-y-10 rounded-[10px] bg-transparent p-8 py-[100px] shadow-sm">
        <div className="text-center">
          <img src={RhaceLogo} alt="Rhace Logo" className="mx-auto w-[150px]" />
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-bold tracking-tight text-gray-800">
            Create Account
          </h3>
          <p className="mt-2 font-medium text-gray-500">
            Join us by filling in your details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
                placeholder="John"
                required
              />
              {errors.first_name && (
                <small className="text-red-500">{errors.first_name}</small>
              )}
            </div>

            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
              {errors.last_name && (
                <small className="text-red-500">{errors.last_name}</small>
              )}
            </div>
          </div>

          <div>
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

          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1234567890"
            />
          </div>

          <div className="relative">
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

          <div className="relative">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirm_password}
              onChange={handleChange}
              placeholder="********"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            {errors.confirm_password && (
              <small className="text-red-500">{errors.confirm_password}</small>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-[10px] bg-blue-600 hover:bg-blue-700"
          >
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
