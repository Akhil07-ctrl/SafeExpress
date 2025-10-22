import { Link } from "react-router-dom";

import OrderRequestsNotification from "../OrderRequestsNotification";

const Navbar = ({ user, driverStatus, onToggleDriverStatus }) => {
  const role = (user?.role || '').toLowerCase();
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h3 className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400 truncate">
              <a href="/">SafeExpress</a>
            </h3>
          </div>

          {/* Navigation Links - Always visible */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {role === "admin" && (
              <Link
                to="/admin/reports"
                onClick={() => window.location.href = "/admin/reports"}
                className="text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Reports
              </Link>
            )}
            {role === "admin" && (
              <div className="mt-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer px-2 py-1 text-brand dark:text-brand-light transition-colors duration-200">
                <OrderRequestsNotification />
              </div>
            )}
            {role === "customer" && (
              <Link
                className="text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                to="/customer/order-requests"
                onClick={() => window.location.href = "/customer/order-requests"}
              >
                My Requests
              </Link>
            )}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Driver toggle - Always visible for drivers */}
            {role === "driver" && (
              <button
                onClick={onToggleDriverStatus}
                className={`relative inline-flex h-6 w-12 sm:h-8 sm:w-16 items-center rounded-full transition-colors duration-200 flex-shrink-0 ${driverStatus === 'available' ? 'bg-green-500' : 'bg-gray-300'}`}
                title={driverStatus === 'available' ? 'Online' : 'Offline'}
              >
                <span
                  className={`inline-block h-4 w-4 sm:h-6 sm:w-6 transform rounded-full bg-white shadow transition-transform duration-200 ${driverStatus === 'available' ? 'translate-x-6 sm:translate-x-8' : 'translate-x-1 sm:translate-x-2'}`}
                />
                <span className="sr-only">Toggle availability</span>
              </button>
            )}

            {/* Profile Link */}
            {user && (
              <Link
                to="/profile"
                className="text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </Link>
            )}

            {/* Logout button */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
