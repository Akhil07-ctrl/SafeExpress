import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { toast } from "react-toastify";

import api from "../utils/api";
import Navbar from "../components/layout/navbar";
import AdminCreateDeliveryModal from "../components/AdminCreateDeliveryModal";
import { getRoute, getBoundsForCoordinates, createCustomIcon, getStatusColor } from "../utils/mapUtils";
import { validateVehicleForm } from "../utils/validation";

const AdminDashboard = ({ user }) => {
  // Data states
  const [vehicles, setVehicles] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  // UI states
  const [mapBounds, setMapBounds] = useState(null);
  const [routeDetails, setRouteDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Form states
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");

  const fetchDeliveryRoute = async (delivery) => {
    if (!delivery) return;
    try {
      const route = await getRoute(
        delivery.pickupCords.lat,
        delivery.pickupCords.lng,
        delivery.dropCords.lat,
        delivery.dropCords.lng
      );
      if (route) {
        setRouteDetails(prev => ({ ...prev, [delivery._id]: route }));
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

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

      // Filter active deliveries
      const activeDelivs = deliveriesRes.data.filter(d => d.status === 'on route');
      setActiveDeliveries(activeDelivs);

      // Set map bounds if there are active deliveries
      if (activeDelivs.length > 0) {
        const coordinates = activeDelivs.flatMap(delivery => [
          { lat: delivery.pickupCords.lat, lng: delivery.pickupCords.lng },
          { lat: delivery.dropCords.lat, lng: delivery.dropCords.lng }
        ]);
        setMapBounds(getBoundsForCoordinates(coordinates));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch routes for active deliveries
  useEffect(() => {
    activeDeliveries.forEach(fetchDeliveryRoute);
  }, [activeDeliveries]);

  // Calculate statistics
  const totalVehicles = vehicles.length;
  const totalDeliveries = deliveries.length;
  const pendingCount = deliveries.filter(d => d.status === 'pending').length;
  const onRouteCount = deliveries.filter(d => d.status === 'on route').length;
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

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
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
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
          </div>

          {/* Delivery Map Overview */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">Active Deliveries Map</h3>
            <div className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden border border-gray-200">
              <MapContainer
                center={[17.385044, 78.486671]}
                zoom={12}
                className="h-full w-full"
                bounds={mapBounds}
                whenCreated={(map) => {
                  if (mapBounds) {
                    map.fitBounds(mapBounds);
                  }
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {activeDeliveries.map(delivery => (
                  <div key={delivery._id}>
                    {/* Pickup Marker */}
                    <Marker
                      position={[delivery.pickupCords.lat, delivery.pickupCords.lng]}
                      icon={createCustomIcon('https://cdn-icons-png.flaticon.com/512/1146/1146778.png', 25)}
                      eventHandlers={{
                        click: () => fetchDeliveryRoute(delivery)
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <h3 className="font-medium">Pickup: {delivery.pickupLocation}</h3>
                          <p>Customer: {delivery.customerName}</p>
                          <p>Time: {new Date(delivery.pickupTime).toLocaleString()}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Drop Marker */}
                    <Marker
                      position={[delivery.dropCords.lat, delivery.dropCords.lng]}
                      icon={createCustomIcon('https://cdn-icons-png.flaticon.com/512/1146/1146869.png', 25)}
                    >
                      <Popup>
                        <div className="text-sm">
                          <h3 className="font-medium">Drop: {delivery.dropLocation}</h3>
                          <p>Status: {delivery.status}</p>
                          <p>Time: {new Date(delivery.dropTime).toLocaleString()}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Route Line */}
                    {routeDetails[delivery._id]?.route && (
                      <Polyline
                        positions={routeDetails[delivery._id].route.map(([lng, lat]) => [lat, lng])}
                        color={getStatusColor(delivery.status)}
                        weight={3}
                        opacity={0.6}
                      />
                    )}
                  </div>
                ))}
              </MapContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: getStatusColor('pending') }} />
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: getStatusColor('on route') }} />
                <span>On Route</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: getStatusColor('delivered') }} />
                <span>Delivered</span>
              </div>
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
                {[...deliveries].reverse().map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">#{d._id.slice(-6)}</td>
                    <td className="px-4 py-2">{d.pickupLocation || `${d.pickupCords.lat.toFixed(4)}, ${d.pickupCords.lng.toFixed(4)}`}</td>
                    <td className="px-4 py-2">{d.dropLocation || `${d.dropCords.lat.toFixed(4)}, ${d.dropCords.lng.toFixed(4)}`}</td>
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
                ))}
              </tbody>
            </table>
          </div>
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
