import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import OrderRequestReviewModal from "../components/OrderRequestReviewModal";
import api from "../utils/api";

const AdminOrderRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  // Address expansion states
  const [expandedAddresses, setExpandedAddresses] = useState({});
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (searchTerm) params.append('search', searchTerm);
      const res = await api.get(`/order-requests?${params.toString()}`);
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to fetch order requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/auth/drivers");
      setDrivers(res.data);
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchDrivers();
    fetchVehicles();
    setCurrentPage(1); // Reset to first page when filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  useEffect(() => {
    fetchRequests();
    setCurrentPage(1); // Reset to first page when search changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleApprove = async (requestId, assignData) => {
    if (!assignData.assignedDriver || !assignData.assignedVehicle) {
      toast.error("Please select both driver and vehicle");
      return;
    }

    if (!assignData.pickupLat || !assignData.pickupLng || !assignData.dropLat || !assignData.dropLng || !assignData.dropTime) {
      toast.error("Please fill in all coordinates and drop time");
      return;
    }

    try {
      const approvalData = {
        assignedDriver: assignData.assignedDriver,
        assignedVehicle: assignData.assignedVehicle,
        pickupCords: {
          lat: parseFloat(assignData.pickupLat),
          lng: parseFloat(assignData.pickupLng),
        },
        dropCords: {
          lat: parseFloat(assignData.dropLat),
          lng: parseFloat(assignData.dropLng),
        },
        dropTime: assignData.dropTime,
        baseFare: assignData.baseFare || selectedRequest.estimatedFare, // Use fare from modal or fallback to request's estimated fare
      };

      await api.post(`/order-requests/${requestId}/approve`, approvalData);
      toast.success("Order request approved and delivery created!");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    }
  };

  const handleReject = async (requestId, rejectReason) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await api.post(`/order-requests/${requestId}/reject`, {
        rejectionReason: rejectReason,
      });
      toast.success("Order request rejected");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Toggle address expansion
  const toggleAddress = (requestId, addressType) => {
    setExpandedAddresses(prev => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [addressType]: !prev[requestId]?.[addressType]
      }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-brand transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Order Requests Management</h2>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by customer name, mobile, locations, or vehicle type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === "pending"
                ? "bg-brand text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("approved")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === "approved"
                ? "bg-brand text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus("rejected")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === "rejected"
                ? "bg-brand text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No {filterStatus} requests found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pickup
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Drop
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estimated Fare
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pickup Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((request) => {
                        const pickupAddress = request.pickupLocation;
                        const dropAddress = request.dropLocation;
                        const isPickupExpanded = expandedAddresses[request._id]?.pickup;
                        const isDropExpanded = expandedAddresses[request._id]?.drop;

                        return (
                          <tr key={request._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {request.customerName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {request.customerId?.email}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {request.customerMobile}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {pickupAddress.length > 40 ? (
                                <div>
                                  {isPickupExpanded ? (
                                    <div>
                                      {pickupAddress}
                                      <button
                                        onClick={() => toggleAddress(request._id, "pickup")}
                                        className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                      >
                                        show less ↑
                                      </button>
                                    </div>
                                  ) : (
                                    <div>
                                      {pickupAddress.slice(0, 40)}...
                                      <button
                                        onClick={() => toggleAddress(request._id, "pickup")}
                                        className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                      >
                                        show more →
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                pickupAddress
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {dropAddress.length > 40 ? (
                                <div>
                                  {isDropExpanded ? (
                                    <div>
                                      {dropAddress}
                                      <button
                                        onClick={() => toggleAddress(request._id, "drop")}
                                        className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                      >
                                        show less ↑
                                      </button>
                                    </div>
                                  ) : (
                                    <div>
                                      {dropAddress.slice(0, 40)}...
                                      <button
                                        onClick={() => toggleAddress(request._id, "drop")}
                                        className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                      >
                                        show more →
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                dropAddress
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {request.vehicleType}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              ₹{request.estimatedFare}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {new Date(request.pickupTime).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  request.status
                                )}`}
                              >
                                {request.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {request.status === "pending" ? (
                                <button
                                  onClick={() => setSelectedRequest(request)}
                                  className="text-brand hover:text-brand-dark font-medium"
                                >
                                  Review
                                </button>
                              ) : request.status === "rejected" ? (
                                <span className="text-gray-500 text-xs">
                                  {request.rejectionReason}
                                </span>
                              ) : (
                                <span className="text-green-600 text-xs">
                                  Delivery Created
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {requests.length > itemsPerPage && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {Math.min((currentPage - 1) * itemsPerPage + 1, requests.length)}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, requests.length)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{requests.length}</span>{' '}
                      results
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(prev => Math.min(prev + 1, Math.ceil(requests.length / itemsPerPage)))
                      }
                      disabled={currentPage === Math.ceil(requests.length / itemsPerPage)}
                      className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Review Modal */}
          {selectedRequest && (
            <OrderRequestReviewModal
              request={selectedRequest}
              drivers={drivers}
              vehicles={vehicles}
              onClose={() => setSelectedRequest(null)}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderRequests;
