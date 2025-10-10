import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

import Navbar from "../components/layout/navbar";
import OrderRequestForm from "../components/OrderRequestForm";
import api from "../utils/api";

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
    try {
      const res = await api.get("/deliveries/my");
      setDeliveries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeliveries();
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
                    <p><span className="text-gray-500">Pickup:</span> {d.pickupCords.lat.toFixed(4)}, {d.pickupCords.lng.toFixed(4)}</p>
                    <p><span className="text-gray-500">Drop:</span> {d.dropCords.lat.toFixed(4)}, {d.dropCords.lng.toFixed(4)}</p>
                    <p><span className="text-gray-500">Driver:</span> {d.assignedDriver?.name}</p>
                    <p><span className="text-gray-500">Mobile:</span> {d.assignedDriver?.mobile}</p>
                    <p><span className="text-gray-500">Pickup Time:</span> {new Date(d.pickupTime).toLocaleString()}</p>
                    <p><span className="text-gray-500">Drop Time:</span> {new Date(d.dropTime).toLocaleString()}</p>
                    <p><span className="text-gray-500">Status:</span> {d.status}</p>
                  </div>

                  <div className="mt-4 relative" style={{ height: '400px', zIndex: 1 }}>
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
                      <Polyline
                        positions={[
                          [d.pickupCords.lat, d.pickupCords.lng],
                          [d.dropCords.lat, d.dropCords.lng]
                        ]}
                        color="blue"
                      />
                      <Marker position={[d.pickupCords.lat, d.pickupCords.lng]}>
                        <Popup>Pickup: {d.pickupCords.lat.toFixed(4)}, {d.pickupCords.lng.toFixed(4)}</Popup>
                      </Marker>
                      <Marker position={[d.dropCords.lat, d.dropCords.lng]}>
                        <Popup>Drop: {d.dropCords.lat.toFixed(4)}, {d.dropCords.lng.toFixed(4)}</Popup>
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
                      <td className="px-4 py-2">{d.pickupCords.lat.toFixed(4)}, {d.pickupCords.lng.toFixed(4)}</td>
                      <td className="px-4 py-2">{d.dropCords.lat.toFixed(4)}, {d.dropCords.lng.toFixed(4)}</td>
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
