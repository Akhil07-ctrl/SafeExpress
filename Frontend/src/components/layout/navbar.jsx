import { Link } from "react-router-dom";

import { logout } from "../../utils/auth";
import OrderRequestsNotification from "../OrderRequestsNotification";

const Navbar = ({ user, driverStatus, onToggleDriverStatus }) => {
  const role = (user?.role || '').toLowerCase();
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold ">SafeExpress</h3>
        <div className="flex items-center gap-4">
          {role === "admin" && <Link className="text-gray-700 hover:text-brand" to="/admin/reports">Reports</Link>}
          {role === "admin" && <OrderRequestsNotification />}
          {role === "customer" && <Link className="text-gray-700 hover:text-brand" to="/customer/order-requests">My Requests</Link>}
          {role === "driver" && (
            <button
              onClick={onToggleDriverStatus}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ${driverStatus === 'available' ? 'bg-green-500' : 'bg-gray-300'}`}
              title={driverStatus === 'available' ? 'Online' : 'Offline'}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 ${driverStatus === 'available' ? 'translate-x-8' : 'translate-x-2'}`}
              />
              <span className="sr-only">Toggle availability</span>
            </button>
          )}
          <button onClick={logout} className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-3 py-1.5">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
