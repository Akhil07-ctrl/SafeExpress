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
    <div>
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Welcome, {user?.name} <span className="text-gray-500 text-base">(Customer)</span></h2>
          <OrderRequestForm user={user} onSuccess={fetchDeliveries} />
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">Total Orders</p>
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <p><span className="text-gray-500">Order ID:</span> #{d._id}</p>
                    <p><span className="text-gray-500">Pickup:</span> {d.pickupLocation}</p>
                    <p><span className="text-gray-500">Drop:</span> {d.dropLocation}</p>
                    <p><span className="text-gray-500">Driver:</span> {d.assignedDriver?.name}</p>
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
                        <Popup>Pickup: {d.pickupLocation}</Popup>
                      </Marker>
                      <Marker position={[d.dropCords.lat, d.dropCords.lng]}>
                        <Popup>Drop: {d.dropLocation}</Popup>
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
                      <td className="px-4 py-2">#{d._id}</td>
                      <td className="px-4 py-2">{d.pickupLocation}</td>
                      <td className="px-4 py-2">{d.dropLocation}</td>
                      <td className="px-4 py-2">{d.assignedDriver?.name}</td>
                      <td className="px-4 py-2">{d.assignedVehicle?.numberPlate}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{d.status}</span>
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
