import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // default role
  const [secretCode, setSecretCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { name, email, password, role: (role || '').toLowerCase() };
      if ((role || '').toLowerCase() === 'admin') {
        payload.secretCode = secretCode;
      }
      if (role === 'driver' || role === 'customer') {
        payload.mobile = mobile;
      }
      await api.post('/auth/register', payload);
      toast.success('User registered successfully');
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ backgroundImage: "url('https://res.cloudinary.com/dgsmgz8zl/image/upload/v1759470817/ChatGPT_Image_Oct_3_2025_11_23_07_AM_haekyu.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        {/* Back button */}
        <Link to="/" onClick={() => window.location.href = "/"} className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 flex items-center space-x-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </Link>

        <h1 className="text-center text-3xl font-bold text-indigo-600 mb-4">SafeExpress</h1>
        <p className="text-center text-gray-600 mb-6">Your one-stop solution for safe and efficient logistics.</p>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="admin">Admin</option>
            <option value="driver">Driver</option>
            <option value="customer">Customer</option>
          </select>

          {role === 'admin' && (
            <input
              type="password"
              placeholder="Admin Secret Code"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          )}

          {(role === 'driver' || role === 'customer') && (
            <input
              type="tel"
              pattern="[0-9]{10}"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile Number (10 digits)"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          )}

          <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white rounded-lg py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 flex justify-center gap-2">Already have an account? <Link to="/login" onClick={() => window.location.href = "/login"} className="text-brand hover:text-brand-dark font-medium">Login here</Link>.</p>
      </div>
    </div>
  );
};

export default Register;
