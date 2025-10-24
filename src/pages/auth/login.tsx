import { Link } from "react-router-dom";
import RhaceLogo from "../../assets/Rhace-10.png";
import { useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { setLoading, setLoadingText } = useLoading();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoadingText("Logging in...");
      setLoading(true);

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
    <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden bg-gray-50">
      {/* Background Bubbles */}
      {/* Login Box */}
      <div className="w-full max-w-lg bg-transparent shadow-sm rounded-[10px] p-8 py-[100px] space-y-10 relative z-10 bg-blend-soft-light">
        <div className="text-center">
          <img src={RhaceLogo} alt="Rhace Logo" className="w-[150px] mx-auto" />
        </div>

        <div className="text-center">
          <h3 className="text-3xl tracking-tight font-bold text-gray-800">
            Welcome Back,
          </h3>
          <p className="font-medium text-gray-500 mt-2">Login to your account</p>
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
          </div>

          <div className="space-y-1 relative">
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
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
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
            className="rounded-[10px] w-full bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
