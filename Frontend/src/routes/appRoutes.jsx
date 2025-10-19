import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import WelcomePage from "../components/layout/welcomePage";
import Register from "../components/auth/register";
import Login from "../components/auth/login";
import ForgotPassword from "../components/auth/forgotPassword";
import ResetPassword from "../components/auth/resetPassword";
import AdminDashboard from "../pages/adminDashboard";
import AdminReports from "../pages/adminReports";
import AdminOrderRequests from "../pages/adminOrderRequests";
import DriverDashboard from "../pages/driverDashboard";
import CustomerDashboard from "../pages/customerDashboard";
import CustomerOrderRequests from "../pages/customerOrderRequests";
import About from "../pages/about";
import Services from "../pages/services";
import Contact from "../pages/contact";
import Careers from "../pages/careers";
import Blog from "../pages/blog";
import Docs from "../pages/docs";
import API from "../pages/api";
import Payment from "../pages/payment";
import ProtectedRoute from "../components/protectedRoute/protectedRoute";
import api from "../utils/api";

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/me") // backend route to get current user from token
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>

  );

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<WelcomePage />} />
        {/* Public pages */}
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services user={user} />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/api" element={<API />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment" element={<Payment user={user} />} />
        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/order-requests"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminOrderRequests user={user} />
            </ProtectedRoute>
          }
        />
        {/* Driver */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={["driver"]}>
              <DriverDashboard user={user} />
            </ProtectedRoute>
          }
        />
        {/* Customer */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={["customer"]}>
              <CustomerDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/order-requests"
          element={
            <ProtectedRoute user={user} allowedRoles={["customer"]}>
              <CustomerOrderRequests user={user} />
            </ProtectedRoute>
          }
        />
        {/* Catch all - redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
