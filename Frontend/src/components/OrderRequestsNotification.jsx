import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../utils/api";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://safeexpress.onrender.com");

const OrderRequestsNotification = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingCount = async () => {
    try {
      const res = await api.get("/order-requests/pending/count");
      setPendingCount(res.data.count);
    } catch (error) {
      console.error("Failed to fetch pending count:", error);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/order-requests?status=pending");
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCount();
    
    // Join order requests room for real-time updates
    socket.emit("joinOrderRequests");

    // Listen for new order requests
    socket.on("orderRequestCreated", () => {
      fetchPendingCount();
      if (isOpen) {
        fetchRequests();
      }
    });

    // Listen for order request status changes
    socket.on("orderRequestStatusChanged", () => {
      fetchPendingCount();
      if (isOpen) {
        fetchRequests();
      }
    });

    return () => {
      socket.off("orderRequestCreated");
      socket.off("orderRequestStatusChanged");
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    fetchRequests();
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative text-gray-700 hover:text-brand transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {pendingCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Order Requests</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : requests.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No pending requests
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {requests.slice(0, 5).map((request) => (
                    <div key={request._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {request.customerName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {request.pickupLocation} → {request.dropLocation}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {requests.length > 0 && (
              <div className="p-3 border-t border-gray-200">
                <Link
                  to="/admin/order-requests"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-brand hover:text-brand-dark font-medium text-sm"
                >
                  View All Requests
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderRequestsNotification;
