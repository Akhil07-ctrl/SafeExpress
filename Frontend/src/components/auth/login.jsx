import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../utils/api";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      toast.success("Login successful!");

      // Redirect based on role
      const role = (res.data.user.role || '').toLowerCase();
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "driver") navigate("/driver/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
      console.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 sm:px-4" style={{ backgroundImage: "url('https://res.cloudinary.com/dgsmgz8zl/image/upload/v1759471113/Gemini_Generated_Image_mylwunmylwunmylw_zac7dw.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8">
        {/* Back button */}
        <Link to="/" className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 flex items-center space-x-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </Link>

        <h1 className="text-center text-2xl sm:text-3xl font-bold text-indigo-600 mb-3 sm:mb-4">SafeExpress</h1>
        <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Your one-stop solution for safe and efficient logistics.</p>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Sign in</h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base"
          />

          <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white rounded-lg py-2 sm:py-2.5 transition text-sm sm:text-base font-medium">Login</button>
        </form>
        <div className="mt-4 sm:mt-6 flex flex-col items-center space-y-2 text-xs sm:text-sm text-gray-600">
          <div className="flex gap-1">
            New user?
            <Link to="/register" className="text-brand hover:text-brand-dark font-medium">Create account</Link>
          </div>
          <Link to="/forgot-password" className="text-gray-500 hover:text-gray-700">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
