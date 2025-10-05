import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Register from "../components/auth/register";
import Login from "../components/auth/login";
import AdminDashboard from "../pages/adminDashboard";
import AdminReports from "../pages/adminReports";
import AdminOrderRequests from "../pages/adminOrderRequests";
import DriverDashboard from "../pages/driverDashboard";
import CustomerDashboard from "../pages/customerDashboard";
import CustomerOrderRequests from "../pages/customerOrderRequests";
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

  // Function to redirect based on role
  const getDashboardRoute = (role) => {
    const r = (role || '').toLowerCase();
    if (r === "admin") return "/admin/dashboard";
    if (r === "driver") return "/driver/dashboard";
    if (r === "customer") return "/customer/dashboard";
    return "/login"; // default fallback
  };

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            user ? <Navigate to={getDashboardRoute(user.role)} /> : <Navigate to="/login" />
          }
        />
        {/* Authentication */}
        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login setUser={setUser} />} />
        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />
        {/* Backward compatible alias */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

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
        {/* Backward compatible alias */}
        <Route path="/driver" element={<Navigate to="/driver/dashboard" replace />} />
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
        {/* Backward compatible alias */}
        <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
        {/* Catch all - redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
