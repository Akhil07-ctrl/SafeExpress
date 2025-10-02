import { useState, useEffect } from "react";
import api from "../utils/api";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Navbar from "../components/layout/navbar";

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
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name} <span className="text-gray-500 text-base">(Customer)</span></h2>

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

      <section className="space-y-4">
        <h3 className="text-lg font-medium">My Deliveries</h3>
        {deliveries.map(d => (
          <div key={d._id} className="bg-white rounded-xl shadow p-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <p><span className="text-gray-500">Pickup:</span> {d.pickupLocation}</p>
              <p><span className="text-gray-500">Drop:</span> {d.dropLocation}</p>
              <p><span className="text-gray-500">Driver:</span> {d.assignedDriver?.name || "Not assigned"}</p>
              <p><span className="text-gray-500">Status:</span> {driverLocations[d._id]?.status || d.status}</p>
            </div>

            {driverLocations[d._id]?.lat && (
              <MapContainer
                center={[driverLocations[d._id].lat, driverLocations[d._id].lng]}
                zoom={13}
                className="leaflet-container rounded-lg overflow-hidden border border-gray-200"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[driverLocations[d._id].lat, driverLocations[d._id].lng]}
                  icon={driverIcon}
                >
                  <Popup>
                    Driver is {driverLocations[d._id].status}
                  </Popup>
                </Marker>
                {myLocation && (
                  <Marker position={[myLocation.lat, myLocation.lng]}>
                    <Popup>Your location</Popup>
                  </Marker>
                )}
              </MapContainer>
            )}
          </div>
        ))}
      </section>
    </div>
    </div>
  );
};

export default CustomerDashboard;
