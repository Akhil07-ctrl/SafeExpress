import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  const role = (user.role || '').toLowerCase();
  const normalizedAllowed = (allowedRoles || []).map(r => (r || '').toLowerCase());
  if (!normalizedAllowed.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
