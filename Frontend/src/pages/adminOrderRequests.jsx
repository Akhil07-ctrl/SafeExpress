import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/layout/navbar";
import api from "../utils/api";

const AdminOrderRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignData, setAssignData] = useState({
    assignedDriver: "",
    assignedVehicle: "",
    pickupLat: "",
    pickupLng: "",
    dropLat: "",
    dropLng: "",
    dropTime: "",
  });
  const [rejectReason, setRejectReason] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/order-requests?status=${filterStatus}`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const handleApprove = async (requestId) => {
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
      };

      await api.post(`/order-requests/${requestId}/approve`, approvalData);
      toast.success("Order request approved and delivery created!");
      setSelectedRequest(null);
      setAssignData({
        assignedDriver: "",
        assignedVehicle: "",
        pickupLat: "",
        pickupLng: "",
        dropLat: "",
        dropLng: "",
        dropTime: "",
      });
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await api.post(`/order-requests/${requestId}/reject`, {
        rejectionReason: rejectReason,
      });
      toast.success("Order request rejected");
      setSelectedRequest(null);
      setRejectReason("");
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

  return (
    <div>
      <Navbar user={user} />
      <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-6">Order Requests Management</h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === "pending"
                ? "bg-brand text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === "approved"
                ? "bg-brand text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === "rejected"
                ? "bg-brand text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Rejected
          </button>
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
                  {requests.map((request) => (
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
                        {request.pickupLocation}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {request.dropLocation}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {request.vehicleType}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Review Order Request</h3>
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setAssignData({
                      assignedDriver: "",
                      assignedVehicle: "",
                      pickupLat: "",
                      pickupLng: "",
                      dropLat: "",
                      dropLng: "",
                      dropTime: "",
                    });
                    setRejectReason("");
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Request Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Request Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <p className="font-medium">{selectedRequest.customerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Mobile:</span>
                      <p className="font-medium">{selectedRequest.customerMobile}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pickup:</span>
                      <p className="font-medium">{selectedRequest.pickupLocation}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Drop:</span>
                      <p className="font-medium">{selectedRequest.dropLocation}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Vehicle Type:</span>
                      <p className="font-medium capitalize">
                        {selectedRequest.vehicleType}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pickup Time:</span>
                      <p className="font-medium">
                        {new Date(selectedRequest.pickupTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Assignment Form */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    Assign Resources
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Driver *
                    </label>
                    <select
                      value={assignData.assignedDriver}
                      onChange={(e) =>
                        setAssignData({
                          ...assignData,
                          assignedDriver: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="">Select a driver</option>
                      {drivers.map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.name} ({driver.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Vehicle *
                    </label>
                    <select
                      value={assignData.assignedVehicle}
                      onChange={(e) =>
                        setAssignData({
                          ...assignData,
                          assignedVehicle: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="">Select a vehicle</option>
                      {vehicles
                        .filter((v) => v.type === selectedRequest.vehicleType)
                        .map((vehicle) => (
                          <option key={vehicle._id} value={vehicle._id}>
                            {vehicle.numberPlate} - {vehicle.type} ({vehicle.status})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup Latitude *
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={assignData.pickupLat}
                        onChange={(e) =>
                          setAssignData({
                            ...assignData,
                            pickupLat: e.target.value,
                          })
                        }
                        placeholder="e.g., 40.7128"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup Longitude *
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={assignData.pickupLng}
                        onChange={(e) =>
                          setAssignData({
                            ...assignData,
                            pickupLng: e.target.value,
                          })
                        }
                        placeholder="e.g., -74.0060"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Drop Latitude *
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={assignData.dropLat}
                        onChange={(e) =>
                          setAssignData({
                            ...assignData,
                            dropLat: e.target.value,
                          })
                        }
                        placeholder="e.g., 40.7580"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Drop Longitude *
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={assignData.dropLng}
                        onChange={(e) =>
                          setAssignData({
                            ...assignData,
                            dropLng: e.target.value,
                          })
                        }
                        placeholder="e.g., -73.9855"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drop Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={assignData.dropTime}
                      onChange={(e) =>
                        setAssignData({
                          ...assignData,
                          dropTime: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>

                {/* Rejection Form */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Or Reject Request
                  </h4>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedRequest._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 font-medium"
                  >
                    Approve & Create Delivery
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2.5 font-medium"
                  >
                    Reject Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderRequests;
