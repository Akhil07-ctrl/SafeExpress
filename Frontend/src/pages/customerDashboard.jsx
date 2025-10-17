import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

import Navbar from "../components/layout/navbar";
import OrderRequestForm from "../components/OrderRequestForm";
import { CardSkeleton, DeliveryCardSkeleton, TableSkeleton } from "../components/SkeletonLoader";
import api from "../utils/api";
import { getRoute } from "../utils/mapUtils";

const socket = io(import.meta.env.VITE_SOCKET_URL || "https://safeexpress.onrender.com");

// Custom driver icon
const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const CustomerDashboard = ({ user }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [driverLocations, setDriverLocations] = useState({}); // { deliveryId: {lat, lng, status} }
  const [myLocation, setMyLocation] = useState(null); // { lat, lng }
  const [isLoading, setIsLoading] = useState(true);
  const [activePlan, setActivePlan] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate stats
  const totalDeliveries = deliveries.length;
  const pendingCount = deliveries.filter(d => d.status === 'pending').length;
  const onRouteCount = deliveries.filter(d => d.status === 'on route').length;
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

  // Get the latest delivery with driver location
  const latestDelivery = deliveries[deliveries.length - 1];
  const latestDriverLocation = latestDelivery ? driverLocations[latestDelivery._id] : null;

  // Fetch deliveries for the current customer
  const fetchDeliveries = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/deliveries/my");
      setDeliveries(res.data);
      // Also fetch active plan when deliveries are updated
      await fetchActivePlan();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch active plan
  const fetchActivePlan = async () => {
    try {
      const res = await api.get("/payments/my-plan");
      setActivePlan(res.data);
    } catch (err) {
      console.error("No active plan found", err);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchActivePlan();
  }, []);

  // Ask for customer's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // silent fail, user may deny permission
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }
  }, []);

  // Calculate route for latest delivery
  useEffect(() => {
    const calculateRoute = async () => {
      if (latestDelivery && latestDelivery.status !== 'delivered') {
        setIsCalculating(true);
        try {
          const route = await getRoute(
            latestDelivery.pickupCords.lat,
            latestDelivery.pickupCords.lng,
            latestDelivery.dropCords.lat,
            latestDelivery.dropCords.lng
          );
          setRouteDetails(route);
        } catch (err) {
          console.error('Error calculating route:', err);
        } finally {
          setIsCalculating(false);
        }
      }
    };

    calculateRoute();
  }, [latestDelivery]);

  useEffect(() => {
    // Join Socket.io rooms for each delivery
    deliveries.forEach(d => {
      socket.emit("joinDelivery", d._id);
    });

    // Listen for driver location updates
    socket.on("locationUpdate", (data) => {
      setDriverLocations(prev => ({
        ...prev,
        [data.deliveryId]: { lat: data.lat, lng: data.lng, status: data.status }
      }));
    });

    // Emit customer location if available
    if (myLocation) {
      deliveries.forEach(d => {
        socket.emit("customerLocation", { deliveryId: d._id, lat: myLocation.lat, lng: myLocation.lng });
      });
    }

    return () => {
      socket.off("locationUpdate");
    };
  }, [deliveries, myLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          {/* Header Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-lg w-40"></div>
            </div>
          </div>

          {/* Overview cards skeleton */}
          <CardSkeleton count={4} />

          {/* Latest Delivery skeleton */}
          <DeliveryCardSkeleton />

          {/* Table skeleton */}
          <TableSkeleton rows={6} columns={7} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
              Welcome, {user?.name}
              <span className="text-gray-500 text-sm sm:text-base ml-2">(Customer)</span>
            </h2>
            <div className="flex-shrink-0">
              <OrderRequestForm user={user} onSuccess={fetchDeliveries} />
            </div>
          </div>
        </div>

        {/* Active Plan Section */}
        {activePlan && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl shadow p-4 mb-6">
            <h4 className="text-md font-semibold mb-2 text-indigo-900">Active Plan</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <p><span className="text-gray-700 font-medium">Plan:</span> {activePlan?.planType ? activePlan.planType.charAt(0).toUpperCase() + activePlan.planType.slice(1) : 'N/A'}</p>
              <p><span className="text-gray-700 font-medium">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${activePlan?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{activePlan?.status || 'N/A'}</span></p>
              <p><span className="text-gray-700 font-medium">Start Date:</span> {activePlan?.startDate ? new Date(activePlan.startDate).toLocaleDateString() : 'N/A'}</p>
              <p><span className="text-gray-700 font-medium">Next Billing:</span> {activePlan?.endDate ? new Date(activePlan.endDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Overview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Orders</p>
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
          <div className="bg-green-50 border border-green-200 rounded-xl shadow p-4 mb-6">
            <h4 className="text-md font-semibold mb-2">Latest Delivery</h4>
            {(() => {
              const d = deliveries[deliveries.length - 1];
              return (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    <p><span className="text-gray-500">Pickup:</span> {d.pickupLocation || `${d.pickupCords.lat.toFixed(4)}, ${d.pickupCords.lng.toFixed(4)}`}</p>
                    <p><span className="text-gray-500">Drop:</span> {d.dropLocation || `${d.dropCords.lat.toFixed(4)}, ${d.dropCords.lng.toFixed(4)}`}</p>
                    <p><span className="text-gray-500">Driver:</span> {d.assignedDriver?.name}</p>
                    <p><span className="text-gray-500">Mobile:</span> {d.assignedDriver?.mobile}</p>
                    <p><span className="text-gray-500">Pickup Time:</span> {new Date(d.pickupTime).toLocaleString()}</p>
                    <p><span className="text-gray-500">Drop Time:</span> {new Date(d.dropTime).toLocaleString()}</p>
                    <p><span className="text-gray-500">Status:</span> {d.status}</p>
                  </div>

                  <div className="mt-4 relative" style={{ height: '400px', zIndex: 1 }}>
                    {isCalculating ? (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Calculating route...</p>
                        </div>
                      </div>
                    ) : (
                      <MapContainer
                        center={latestDriverLocation ? [latestDriverLocation.lat, latestDriverLocation.lng] : [d.pickupCords.lat, d.pickupCords.lng]}
                        zoom={13}
                        style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 1 }}
                        className="border border-gray-200"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {latestDriverLocation && (
                          <Marker position={[latestDriverLocation.lat, latestDriverLocation.lng]} icon={driverIcon}>
                            <Popup>Driver's Location</Popup>
                          </Marker>
                        )}
                        {myLocation && (
                          <Marker position={[myLocation.lat, myLocation.lng]}>
                            <Popup>Your Location</Popup>
                          </Marker>
                        )}
                        {routeDetails?.route && (
                          <Polyline
                            positions={routeDetails.route.map(([lng, lat]) => [lat, lng])}
                            color="#0066cc"
                            weight={4}
                            opacity={0.7}
                          />
                        )}
                        <Marker position={[d.pickupCords.lat, d.pickupCords.lng]}>
                          <Popup>Pickup: {d.pickupLocation || `${d.pickupCords.lat.toFixed(4)}, ${d.pickupCords.lng.toFixed(4)}`}</Popup>
                        </Marker>
                        <Marker position={[d.dropCords.lat, d.dropCords.lng]}>
                          <Popup>Drop: {d.dropLocation || `${d.dropCords.lat.toFixed(4)}, ${d.dropCords.lng.toFixed(4)}`}</Popup>
                        </Marker>
                      </MapContainer>
                    )}
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...deliveries]
                  .slice(0, -1)
                  .reverse()
                  .map((d) => (
                    <tr key={d._id}>
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

export default CustomerDashboard;
