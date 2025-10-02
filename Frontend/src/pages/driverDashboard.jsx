import { useState, useEffect } from "react";
import api from "../utils/api";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import Navbar from "../components/layout/navbar";

const socket = io("http://localhost:3000");

// Custom driver icon
const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const DriverDashboard = ({ user }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

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

  useEffect(() => {
    fetchDeliveries();
  }, []);

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
  }, [deliveries]);

  // Update delivery status
  const updateStatus = async (deliveryId, newStatus) => {
    try {
      const res = await api.put(`/deliveries/${deliveryId}/status`, { status: newStatus });
      setDeliveries(prev =>
        prev.map(d => (d._id === deliveryId ? res.data : d))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar user={user} />
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

        {deliveries.map(d => (
          <div key={d._id} className="bg-white rounded-xl shadow p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <p><span className="text-gray-500">Pickup:</span> {d.pickupLocation}</p>
              <p><span className="text-gray-500">Drop:</span> {d.dropLocation}</p>
              <p><span className="text-gray-500">Status:</span> {d.status}</p>
            </div>

            <div>
              {d.status === "pending" && (
                <button onClick={() => updateStatus(d._id, "on route")} className="bg-brand hover:bg-brand-dark text-white rounded-lg px-4 py-2 mr-2">Start Delivery</button>
              )}
              {d.status === "on route" && (
                <button onClick={() => updateStatus(d._id, "delivered")} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2">Mark Delivered</button>
              )}
            </div>

            {currentLocation.lat !== 0 && (
              <MapContainer
                center={[currentLocation.lat, currentLocation.lng]}
                zoom={13}
                className="leaflet-container rounded-lg overflow-hidden border border-gray-200"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Driver marker */}
                <Marker position={[currentLocation.lat, currentLocation.lng]} icon={driverIcon}>
                  <Popup>Your location</Popup>
                </Marker>

                {/* Optionally: show line from pickup to drop */}
                <Polyline
                  positions={[
                    [d.pickupCords.lat, d.pickupCords.lng],
                    [d.dropCords.lat, d.dropCords.lng]
                  ]}
                  color="blue"
                />

                {/* Pickup marker */}
                <Marker position={[d.pickupCords.lat, d.pickupCords.lng]}>
                  <Popup>Pickup: {d.pickupLocation}</Popup>
                </Marker>

                {/* Drop marker */}
                <Marker position={[d.dropCords.lat, d.dropCords.lng]}>
                  <Popup>Drop: {d.dropLocation}</Popup>
                </Marker>


              </MapContainer>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverDashboard;
