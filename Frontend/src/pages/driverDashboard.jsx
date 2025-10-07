import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { toast } from "react-toastify";

import Navbar from "../components/layout/navbar";
import api from "../utils/api";
import { getRoute, getBoundsForCoordinates, getStatusColor, createCustomIcon } from "../utils/mapUtils";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://safeexpress.onrender.com");

// Custom driver icon
const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const DriverDashboard = ({ user }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [driverStatus, setDriverStatus] = useState('unavailable');
  const [routeDetails, setRouteDetails] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);

  // Calculate stats
  const totalDeliveries = deliveries.length;
  const pendingCount = deliveries.filter(d => d.status === 'pending').length;
  const onRouteCount = deliveries.filter(d => d.status === 'on route').length;
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

  // Fetch deliveries assigned to this driver
  const fetchDeliveries = async () => {
    try {
      const res = await api.get("/deliveries/my");
      setDeliveries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch driver's current status
  const fetchDriverStatus = useCallback(async () => {
    try {
      const res = await api.get(`/drivers/status/${user.id}`);
      setDriverStatus(res.data.driverStatus);
    } catch (err) {
      console.error('Error fetching driver status:', err);
    }
  }, [user.id]);

  // Toggle driver's availability status
  const toggleDriverStatus = async () => {
    try {
      const newStatus = driverStatus === 'available' ? 'unavailable' : 'available';
      const res = await api.put('/drivers/status', { driverStatus: newStatus });
      setDriverStatus(res.data.driverStatus);
      toast.success(`Status updated to ${res.data.driverStatus}`);
    } catch (err) {
      console.error('Error updating driver status:', err);
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchDriverStatus();
  }, [fetchDriverStatus]);

  // Calculate route and set map bounds
  useEffect(() => {
    const calculateRouteAndBounds = async () => {
      if (deliveries.length > 0 && currentLocation.lat !== 0) {
        const activeDelivery = deliveries[deliveries.length - 1];
        if (activeDelivery.status !== 'delivered') {
          // Get route details
          const route = await getRoute(
            currentLocation.lat,
            currentLocation.lng,
            activeDelivery.dropCords.lat,
            activeDelivery.dropCords.lng
          );
          setRouteDetails(route);

          // Calculate bounds
          const coordinates = [
            { lat: currentLocation.lat, lng: currentLocation.lng },
            { lat: activeDelivery.pickupCords.lat, lng: activeDelivery.pickupCords.lng },
            { lat: activeDelivery.dropCords.lat, lng: activeDelivery.dropCords.lng }
          ];
          setMapBounds(getBoundsForCoordinates(coordinates));
        }
      }
    };

    calculateRouteAndBounds();
  }, [deliveries, currentLocation]);

  // Track driver's current location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          // Send location to server for each active delivery
          deliveries.forEach(d => {
            if (d.status !== "delivered") {
              socket.emit("driverLocation", {
                deliveryId: d._id,
                lat: latitude,
                lng: longitude,
                status: d.status,
                driverId: user._id,
              });
            }
          });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 1000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [deliveries, user._id]);

  // Update delivery status
  const updateStatus = async (deliveryId, newStatus) => {
    try {
      const res = await api.put(`/deliveries/${deliveryId}/status`, { status: newStatus });
      setDeliveries(prev =>
        prev.map(d => (d._id === deliveryId ? res.data : d))
      );
      toast.success("Delivery status updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating delivery status");
    }
  };

  return (
    <div>
      <Navbar user={user} driverStatus={driverStatus} onToggleDriverStatus={toggleDriverStatus} />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name} <span className="text-gray-500 text-base">(Driver)</span></h2>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">Total Deliveries</p>
            <p className="text-2xl font-semibold">{totalDeliveries}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-semibold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">On Route</p>
            <p className="text-2xl font-semibold text-blue-600">{onRouteCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">Delivered</p>
            <p className="text-2xl font-semibold text-green-600">{deliveredCount}</p>
          </div>
        </div>

        {/* Latest Delivery */}
        {deliveries.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl shadow p-4 mb-6">
            <h4 className="text-md font-semibold mb-2">Latest Delivery</h4>
            {(() => {
              const d = deliveries[deliveries.length - 1];
              return (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2">
                    <p><span className="text-gray-500">Pickup:</span> {d.pickupLocation}</p>
                    <p><span className="text-gray-500">Drop:</span> {d.dropLocation}</p>
                    <p><span className="text-gray-500">Customer:</span> {d.customerName}</p>
                    <p><span className="text-gray-500">Phone:</span> {d.customerMobile}</p>
                    <p><span className="text-gray-500">Pickup Time:</span> {new Date(d.pickupTime).toLocaleString()}</p>
                    <p><span className="text-gray-500">Drop Time:</span> {new Date(d.dropTime).toLocaleString()}</p>
                    <p><span className="text-gray-500">Status:</span> {d.status}</p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    {d.status === "pending" && (
                      <button onClick={() => updateStatus(d._id, "on route")} className="bg-brand hover:bg-brand-dark text-white rounded-lg px-4 py-2 mr-2">Start Delivery</button>
                    )}
                    {d.status === "on route" && (
                      <button onClick={() => updateStatus(d._id, "delivered")} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2">Mark Delivered</button>
                    )}
                  </div>
                  <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200 mt-2">
                    <MapContainer
                      bounds={mapBounds}
                      className="h-full w-full"
                      zoom={13}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                      {/* Driver's current location */}
                      {currentLocation.lat !== 0 && (
                        <Marker
                          position={[currentLocation.lat, currentLocation.lng]}
                          icon={driverIcon}
                        >
                          <Popup>
                            <div className="text-center">
                              <h3 className="font-medium">Your Location</h3>
                              <p className="text-sm text-gray-600">
                                Last updated: {new Date().toLocaleTimeString()}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      )}

                      {/* Route display */}
                      {routeDetails?.route && (
                        <Polyline
                          positions={routeDetails.route.map(([lng, lat]) => [lat, lng])}
                          color={getStatusColor(d.status)}
                          weight={4}
                          opacity={0.7}
                        />
                      )}

                      {/* Pickup location */}
                      <Marker
                        position={[d.pickupCords.lat, d.pickupCords.lng]}
                        icon={createCustomIcon('https://cdn-icons-png.flaticon.com/512/1146/1146778.png', 25)}
                      >
                        <Popup>
                          <div>
                            <h3 className="font-medium">Pickup Location</h3>
                            <p className="text-sm">{d.pickupLocation}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(d.pickupTime).toLocaleString()}
                            </p>
                          </div>
                        </Popup>
                      </Marker>

                      {/* Drop location */}
                      <Marker
                        position={[d.dropCords.lat, d.dropCords.lng]}
                        icon={createCustomIcon('https://cdn-icons-png.flaticon.com/512/1146/1146869.png', 25)}
                      >
                        <Popup>
                          <div>
                            <h3 className="font-medium">Drop Location</h3>
                            <p className="text-sm">{d.dropLocation}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              Expected arrival: {new Date(d.dropTime).toLocaleString()}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Rest of Deliveries */}
        <section className="bg-white rounded-xl shadow p-5">
          <h3 className="text-lg font-medium mb-4">All Deliveries</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...deliveries]
                  .slice(0, -1)
                  .reverse()
                  .map((d) => (
                    <tr key={d._id}>
                      <td className="px-4 py-2">#{d._id}</td>
                      <td className="px-4 py-2">{d.pickupLocation}</td>
                      <td className="px-4 py-2">{d.dropLocation}</td>
                      <td className="px-4 py-2">{d.assignedVehicle?.numberPlate}</td>
                      <td className="px-4 py-2">{d.customerName}</td>
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
      </div>
    </div>
  );
};

export default DriverDashboard;
