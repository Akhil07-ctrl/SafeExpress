import { Link } from "react-router-dom";

import { logout } from "../../utils/auth";
import OrderRequestsNotification from "../OrderRequestsNotification";

const Navbar = ({ user }) => {
  const role = (user?.role || '').toLowerCase();
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">SafeExpress</h3>
        <div className="flex items-center gap-4">
          {role === "admin" && <Link className="text-gray-700 hover:text-brand" to="/admin/reports">Reports</Link>}
          {role === "admin" && <OrderRequestsNotification />}
          {role === "customer" && <Link className="text-gray-700 hover:text-brand" to="/customer/order-requests">My Requests</Link>}
          <button onClick={logout} className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-3 py-1.5">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
