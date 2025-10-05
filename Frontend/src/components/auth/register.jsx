import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // default role
  const [secretCode, setSecretCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, email, password, role: (role || '').toLowerCase() };
      if ((role || '').toLowerCase() === 'admin') {
        payload.secretCode = secretCode;
      }
      await api.post("/auth/register", payload);
      toast.success('User registered successfully');
      console.log("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.msg;
      console.error(err);
      toast.error(serverMsg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ backgroundImage: "url('https://res.cloudinary.com/dgsmgz8zl/image/upload/v1759470817/ChatGPT_Image_Oct_3_2025_11_23_07_AM_haekyu.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
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

          <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white rounded-lg py-2.5 transition">Register</button>
        </form>
        <p className="mt-4 text-sm text-gray-600">Already have an account? <a href="/login" className="text-brand hover:underline">Login here</a>.</p>
      </div>
    </div>
  );
};

export default Register;
