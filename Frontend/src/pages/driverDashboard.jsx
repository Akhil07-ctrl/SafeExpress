import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { toast } from "react-toastify";

import Navbar from "../components/layout/navbar";
import { CardSkeleton, DeliveryCardSkeleton, TableSkeleton } from "../components/SkeletonLoader";
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
  const [isLoading, setIsLoading] = useState(true);

  // Calculate stats
  const totalDeliveries = deliveries.length;
  const pendingCount = deliveries.filter(d => d.status === 'pending').length;
  const onRouteCount = deliveries.filter(d => d.status === 'on route').length;
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

  // Fetch deliveries assigned to this driver
  const fetchDeliveries = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/deliveries/my");
      setDeliveries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch driver's current status
  const fetchDriverStatus = useCallback(async () => {
    try {
      console.log('Fetching driver status for user:', user._id);
      const res = await api.get(`/drivers/status/${user._id}`);
      console.log('Driver status response:', res.data);
      setDriverStatus(res.data.driverStatus);
    } catch (err) {
      console.error('Error fetching driver status:', err);
    }
  }, [user._id]);

  // Toggle driver's availability status
  const toggleDriverStatus = async () => {
    try {
      const newStatus = driverStatus === 'available' ? 'unavailable' : 'available';
      console.log('Toggling driver status from', driverStatus, 'to', newStatus);
      const res = await api.put('/drivers/status', { driverStatus: newStatus });
      console.log('API response:', res.data);
      setDriverStatus(res.data.driverStatus);
      if (res.data.driverStatus === 'available') {
        toast.success('You are now available for deliveries');
      } else {
        toast.info('You are now unavailable for deliveries');
      }
    } catch (err) {
      console.error('Error updating driver status:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} driverStatus={driverStatus} onToggleDriverStatus={toggleDriverStatus} />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          {/* Header Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Overview cards skeleton */}
          <CardSkeleton count={4} />

          {/* Latest Delivery skeleton */}
          <DeliveryCardSkeleton />

          {/* Table skeleton */}
          <TableSkeleton rows={6} columns={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} driverStatus={driverStatus} onToggleDriverStatus={toggleDriverStatus} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
            Welcome, {user?.name}
            <span className="text-gray-500 text-sm sm:text-base ml-2">(Driver)</span>
          </h2>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Deliveries</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">{totalDeliveries}</p>
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

        {/* Latest Delivery */}
        {deliveries.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">Latest Delivery</h4>
            {(() => {
              const d = deliveries[deliveries.length - 1];
              return (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    <div className="bg-white rounded-md p-3">
                      <p className="text-xs text-gray-500 font-medium">Pickup</p>
                      <p className="text-sm text-gray-900 truncate">{d.pickupLocation || `${d.pickupCords.lat.toFixed(4)}, ${d.pickupCords.lng.toFixed(4)}`}</p>
                    </div>
                    <div className="bg-white rounded-md p-3">
                      <p className="text-xs text-gray-500 font-medium">Drop</p>
                      <p className="text-sm text-gray-900 truncate">{d.dropLocation || `${d.dropCords.lat.toFixed(4)}, ${d.dropCords.lng.toFixed(4)}`}</p>
                    </div>
                    <div className="bg-white rounded-md p-3">
                      <p className="text-xs text-gray-500 font-medium">Customer</p>
                      <p className="text-sm text-gray-900">{d.customerName}</p>
                    </div>
                    <div className="bg-white rounded-md p-3">
                      <p className="text-xs text-gray-500 font-medium">Phone</p>
                      <p className="text-sm text-gray-900">{d.customerMobile}</p>
                    </div>
                    <div className="bg-white rounded-md p-3">
                      <p className="text-xs text-gray-500 font-medium">Pickup Time</p>
                      <p className="text-sm text-gray-900">{new Date(d.pickupTime).toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-md p-3">
                      <p className="text-xs text-gray-500 font-medium">Drop Time</p>
                      <p className="text-sm text-gray-900">{new Date(d.dropTime).toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-md p-3">
                      <p className="text-xs text-gray-500 font-medium">Status</p>
                      <p className="text-sm text-gray-900 capitalize">{d.status}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mb-4">
                    {d.status === "pending" && (
                      <button
                        onClick={() => updateStatus(d._id, "on route")}
                        className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                      >
                        Start Delivery
                      </button>
                    )}
                    {d.status === "on route" && (
                      <button
                        onClick={() => updateStatus(d._id, "delivered")}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                  <div className="h-[250px] sm:h-[350px] lg:h-[400px] rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      bounds={mapBounds}
                      center={mapBounds ? undefined : [17.385044, 78.486671]}
                      zoom={mapBounds ? undefined : 11}
                      className="h-full w-full"
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
                            <p className="text-sm">{d.pickupLocation || `${d.pickupCords.lat.toFixed(4)}, ${d.pickupCords.lng.toFixed(4)}`}</p>
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
                            <p className="text-sm">{d.dropLocation || `${d.dropCords.lat.toFixed(4)}, ${d.dropCords.lng.toFixed(4)}`}</p>
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
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-gray-900">All Deliveries</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Pickup</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Drop</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Vehicle</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...deliveries]
                  .slice(0, -1)
                  .reverse()
                  .map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">#{d._id.slice(-6)}</td>
                      <td className="px-4 py-2">{d.pickupLocation || `${d.pickupCords.lat.toFixed(4)}, ${d.pickupCords.lng.toFixed(4)}`}</td>
                      <td className="px-4 py-2">{d.dropLocation || `${d.dropCords.lat.toFixed(4)}, ${d.dropCords.lng.toFixed(4)}`}</td>
                      <td className="px-4 py-2">{d.assignedDriver?.name}</td>
                      <td className="px-4 py-2">{d.assignedDriver?.mobile}</td>
                      <td className="px-4 py-2">{d.assignedVehicle?.numberPlate}</td>
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
