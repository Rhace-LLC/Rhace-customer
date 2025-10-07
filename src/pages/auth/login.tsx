import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-blue-600">
          Login
        </h2>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <Link to="/forgot-password" className="hover:text-blue-600">
            Forgot Password?
          </Link>
          <Link to="/signup" className="hover:text-blue-600">
            Don’t have an account? Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
