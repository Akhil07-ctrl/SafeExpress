import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import api from "../utils/api";
import Navbar from "../components/layout/navbar";
import AdminCreateDeliveryModal from "../components/AdminCreateDeliveryModal";
import { CardSkeleton, TableSkeleton } from "../components/SkeletonLoader";
import { validateVehicleForm } from "../utils/validation";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://safeexpress.onrender.com");

const AdminDashboard = ({ user }) => {
  // Data states
  const [vehicles, setVehicles] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  const [drivers, setDrivers] = useState([]);
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Form states
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  // Address expansion states
  const [expandedAddresses, setExpandedAddresses] = useState({});
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;



  // Fetch all vehicles and deliveries
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [vehiclesRes, deliveriesRes, driversRes] = await Promise.all([
        api.get("/vehicles"),
        api.get("/deliveries"),
        api.get("/auth/drivers")
      ]);

      setVehicles(vehiclesRes.data);
      setDeliveries(deliveriesRes.data);
      setDrivers(driversRes.data);

      // Calculate total revenue from paid deliveries
      const paidDeliveries = deliveriesRes.data.filter(d => d.paymentStatus === 'paid');
      const revenue = paidDeliveries.reduce((sum, d) => {
        const fare = Number(d.baseFare) || 0;
        return sum + fare;
      }, 0);
      setTotalRevenue(revenue);


    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for deliveryPaid event
    socket.on('deliveryPaid', (data) => {
      // Refresh analytics to show updated revenue
      fetchData();
      toast.success(`Payment received: ₹${data.amount} from ${data.customerName}`);
    });

    return () => {
      socket.off('deliveryPaid');
    };
  }, []);



  // Calculate statistics
  const totalVehicles = vehicles.length;
  const totalDeliveries = deliveries.length;
  const pendingCount = deliveries.filter(d => d.status === 'pending').length;
  const onRouteCount = deliveries.filter(d => d.status === 'on route').length;
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

  // Toggle address expansion
  const toggleAddress = (deliveryId, addressType) => {
    setExpandedAddresses(prev => ({
      ...prev,
      [deliveryId]: {
        ...prev[deliveryId],
        [addressType]: !prev[deliveryId]?.[addressType]
      }
    }));
  };

  // Add Vehicle
  const handleAddVehicle = async (e) => {
    e.preventDefault();

    const formValues = {
      vehicleNumber,
      vehicleType,
      capacity: vehicleCapacity
    };

    const errors = validateVehicleForm(formValues);
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }

    try {
      await api.post("/vehicles", { numberPlate: vehicleNumber, type: vehicleType, capacity: Number(vehicleCapacity) });
      console.log("Vehicle added successfully!");
      setVehicleNumber("");
      setVehicleType("");
      setVehicleCapacity("");
      fetchData();
      toast.success("Vehicle added successfully!");
    } catch (err) {
      console.error(err.response?.data?.message || "Error adding vehicle");
      toast.error(err.response?.data?.message || "Error adding vehicle");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar user={user} />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-lg w-40"></div>
              </div>
            </div>

            {/* Overview cards skeleton */}
            <CardSkeleton count={5} />



            {/* Add Vehicle skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Table skeleton */}
            <TableSkeleton rows={8} columns={9} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                Welcome, {user?.name}
                <span className="text-gray-500 text-sm sm:text-base ml-2">(Admin)</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-brand hover:bg-brand-dark text-white rounded-lg px-6 py-3 font-medium shadow-md transition-all"
              >
                + Create Delivery
              </button>
            </div>
          </div>

          {/* Overview cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Vehicles</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">{totalVehicles}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Deliveries</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 mt-1">{totalDeliveries}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Pending</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">On Route</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mt-1">{onRouteCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Delivered</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mt-1">{deliveredCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Revenue</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mt-1">₹{totalRevenue.toFixed(2)}</p>
            </div>
          </div>



          {/* Add Vehicle */}
          <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-900">Add Vehicle</h3>
            <form onSubmit={handleAddVehicle} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <input
                placeholder="Vehicle Number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option value="">Select Vehicle Type</option>
                <option value="tata 407">Tata 407</option>
                <option value="ashok leyland ecomet">Ashok Leyland Ecomet</option>
                <option value="mahindra supro maxi truck">Mahindra Supro Maxi Truck</option>
                <option value="eicher pro 3015">Eicher Pro 3015</option>
                <option value="bharath benz 2523r">Bharath Benz 2523R</option>
              </select>
              <input
                placeholder="Capacity (kg)"
                type="number"
                min="0"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white rounded-lg px-4 py-2 text-sm sm:text-base font-medium transition-colors duration-200"
              >
                Add Vehicle
              </button>
            </form>
          </section>

          {/* View All Deliveries */}
          <section className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-medium mb-4">All Deliveries</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...deliveries]
                    .reverse()
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((d) => {
                    const pickupAddress = d.pickupLocation || `${d.pickupCords.lat.toFixed(4)}, ${d.pickupCords.lng.toFixed(4)}`;
                    const dropAddress = d.dropLocation || `${d.dropCords.lat.toFixed(4)}, ${d.dropCords.lng.toFixed(4)}`;
                    const isPickupExpanded = expandedAddresses[d._id]?.pickup;
                    const isDropExpanded = expandedAddresses[d._id]?.drop;

                    return (
                      <tr key={d._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">#{d._id.slice(-6)}</td>
                        <td className="px-4 py-2">
                          {pickupAddress.length > 40 ? (
                            <div>
                              {isPickupExpanded ? (
                                <div>
                                  {pickupAddress}
                                  <button
                                    onClick={() => toggleAddress(d._id, 'pickup')}
                                    className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                  >
                                    show less ↑
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  {pickupAddress.slice(0, 40)}...
                                  <button
                                    onClick={() => toggleAddress(d._id, 'pickup')}
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
                        <td className="px-4 py-2">
                          {dropAddress.length > 40 ? (
                            <div>
                              {isDropExpanded ? (
                                <div>
                                  {dropAddress}
                                  <button
                                    onClick={() => toggleAddress(d._id, 'drop')}
                                    className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                  >
                                    show less ↑
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  {dropAddress.slice(0, 40)}...
                                  <button
                                    onClick={() => toggleAddress(d._id, 'drop')}
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
                        <td className="px-4 py-2">{d.assignedDriver?.name}</td>
                        <td className="px-4 py-2">{d.assignedDriver?.mobile}</td>
                        <td className="px-4 py-2">{d.assignedVehicle?.numberPlate}</td>
                        <td className="px-4 py-2">{d.customerName}</td>
                        <td className="px-4 py-2">{d.customerMobile}</td>
                        <td className="px-4 py-2">
                          {d.status === "pending" ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{d.status}</span> : null}
                          {d.status === "on route" ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{d.status}</span> : null}
                          {d.status === "delivered" ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{d.status}</span> : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {deliveries.length > itemsPerPage && (
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {Math.min((currentPage - 1) * itemsPerPage + 1, deliveries.length)}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, deliveries.length)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{deliveries.length}</span>{' '}
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(deliveries.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(deliveries.length / itemsPerPage)}
                    className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Admin Create Delivery Modal */}
          <AdminCreateDeliveryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={fetchData}
            drivers={drivers}
            vehicles={vehicles}
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
