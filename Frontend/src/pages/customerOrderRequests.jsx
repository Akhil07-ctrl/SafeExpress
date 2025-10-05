import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/layout/navbar";
import api from "../utils/api";

const CustomerOrderRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/order-requests/my");
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to fetch order requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

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
        <h2 className="text-2xl font-semibold mb-6">My Order Requests</h2>

        <div className="bg-white rounded-xl shadow">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No order requests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
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
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.createdAt).toLocaleDateString()}
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
                        {request.status === "rejected" && (
                          <span className="text-red-600 text-xs">
                            {request.rejectionReason}
                          </span>
                        )}
                        {request.status === "approved" && request.deliveryId && (
                          <span className="text-green-600 text-xs">
                            Delivery Created
                          </span>
                        )}
                        {request.status === "pending" && (
                          <span className="text-yellow-600 text-xs">
                            Awaiting Review
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
      </div>
    </div>
  );
};

export default CustomerOrderRequests;
