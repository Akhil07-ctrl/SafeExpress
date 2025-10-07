import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
import { toast } from "react-toastify";

import api from "../utils/api";
import Navbar from "../components/layout/navbar";
import { getRoute, getBoundsForCoordinates, createCustomIcon, getStatusColor } from "../utils/mapUtils";
import { validateVehicleForm, validateDeliveryForm } from "../utils/validation";

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
  // Form states
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupLat, setPickupLat] = useState("");
  const [pickupLng, setPickupLng] = useState("");
  const [dropLat, setDropLat] = useState("");
  const [dropLng, setDropLng] = useState("");
  const [activePoint, setActivePoint] = useState("pickup"); // 'pickup' | 'drop'
  const [searchPickup, setSearchPickup] = useState("");
  const [searchDrop, setSearchDrop] = useState("");
  // Delivery form states
  const [assignedDriver, setAssignedDriver] = useState("");
  const [assignedVehicle, setAssignedVehicle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");

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

  const ClickSetter = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (activePoint === "pickup") {
          setPickupLat(lat.toFixed(6));
          setPickupLng(lng.toFixed(6));
        } else {
          setDropLat(lat.toFixed(6));
          setDropLng(lng.toFixed(6));
        }
      },
    });
    return null;
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

  // Create Delivery
  const handleCreateDelivery = async (e) => {
    e.preventDefault();

    const formValues = {
      pickupLocation,
      dropLocation,
      pickupLat,
      pickupLng,
      dropLat,
      dropLng,
      assignedDriver,
      assignedVehicle,
      customerName,
      customerMobile,
      pickupTime,
      dropTime
    };

    const errors = validateDeliveryForm(formValues);
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }

    try {
      await api.post("/deliveries", {
        pickupLocation,
        dropLocation,
        pickupCords: { lat: Number(pickupLat), lng: Number(pickupLng) },
        dropCords: { lat: Number(dropLat), lng: Number(dropLng) },
        assignedDriver,
        assignedVehicle,
        customerName,
        customerMobile,
        pickupTime,
        dropTime,
      });
      console.log("Delivery created successfully!");
      setPickupLocation(""); setDropLocation(""); setPickupLat(""); setPickupLng(""); setDropLat(""); setDropLng(""); setAssignedDriver(""); setAssignedVehicle(""); setCustomerName(""); setCustomerMobile(""); setPickupTime(""); setDropTime("");
      fetchData();
      toast.success("Delivery created successfully!");
    } catch (err) {
      console.error(err.response?.data?.message || "Error creating delivery");
      toast.error(err.response?.data?.message || "Error creating delivery");
    }
  };

  const geocode = async (query, which) => {
    if (!query) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat).toFixed(6);
        const lon = parseFloat(data[0].lon).toFixed(6);
        if (which === 'pickup') { setPickupLat(lat); setPickupLng(lon); }
        else { setDropLat(lat); setDropLng(lon); }
      } else {
        console.warn('No geocoding results found');
      }
    } catch (e) {
      console.error(e);
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
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        <h2 className="text-2xl font-semibold">Welcome, {user?.name} <span className="text-gray-500 text-base">(Admin)</span></h2>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">Vehicles</p>
            <p className="text-2xl font-semibold">{totalVehicles}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">Deliveries</p>
            <p className="text-2xl font-semibold text-orange-600">{totalDeliveries}</p>
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

        {/* Delivery Map Overview */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Active Deliveries Map</h3>
          <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
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
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor('pending') }} />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor('on route') }} />
              <span>On Route</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor('delivered') }} />
              <span>Delivered</span>
            </div>
          </div>
        </div>

        {/* Add Vehicle Modal */}
        <section className="bg-white rounded-xl shadow p-5">
          <h3 className="text-lg font-medium mb-4">Add Vehicle</h3>
          <form onSubmit={handleAddVehicle} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <select
              placeholder="Vehicle Type"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
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
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button type="submit" className="bg-brand hover:bg-brand-dark text-white rounded-lg px-4 py-2">Add Vehicle</button>
          </form>
        </section>

        {/* Create Delivery */}
        <section className="bg-white rounded-xl shadow p-5">
          <h3 className="text-lg font-medium mb-4">Create Delivery</h3>
          <form onSubmit={handleCreateDelivery} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Pickup Location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              placeholder="Drop Location"
              value={dropLocation}
              onChange={(e) => setDropLocation(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              placeholder="Customer Mobile"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <select
              placeholder="Vehicle Type"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="truck">Truck</option>
              <option value="bike">Bike</option>
              <option value="van">Van</option>
            </select>
            <div className="space-y-3 col-span-1 sm:col-span-2">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setActivePoint('pickup')} className={`px-3 py-1.5 rounded-lg border ${activePoint === 'pickup' ? 'bg-brand text-white border-brand' : 'border-gray-300'}`}>Set Pickup</button>
                <button type="button" onClick={() => setActivePoint('drop')} className={`px-3 py-1.5 rounded-lg border ${activePoint === 'drop' ? 'bg-brand text-white border-brand' : 'border-gray-300'}`}>Set Drop</button>
                <span className="text-sm text-gray-500">Click on the map to set coordinates</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex gap-2">
                  <input
                    placeholder="Search pickup address"
                    value={searchPickup}
                    onChange={(e) => setSearchPickup(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button type="button" onClick={() => geocode(searchPickup, 'pickup')} className="bg-gray-900 text-white rounded-lg px-3">Find</button>
                </div>
                <div className="flex gap-2">
                  <input
                    placeholder="Search drop address"
                    value={searchDrop}
                    onChange={(e) => setSearchDrop(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button type="button" onClick={() => geocode(searchDrop, 'drop')} className="bg-gray-900 text-white rounded-lg px-3">Find</button>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 h-[300px]">
                <MapContainer
                  center={[17.385044, 78.486671]}
                  zoom={11}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <ClickSetter />
                  {pickupLat && pickupLng && (
                    <Marker
                      icon={createCustomIcon('https://cdn-icons-png.flaticon.com/512/1146/1146778.png', 25)}
                      position={[Number(pickupLat), Number(pickupLng)]}
                    >
                      <Popup>
                        <div className="text-sm">
                          <h3 className="font-medium">Pickup Location</h3>
                          <p>Coordinates: {pickupLat}, {pickupLng}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  {dropLat && dropLng && (
                    <Marker
                      icon={createCustomIcon('https://cdn-icons-png.flaticon.com/512/1146/1146869.png', 25)}
                      position={[Number(dropLat), Number(dropLng)]}
                    >
                      <Popup>
                        <div className="text-sm">
                          <h3 className="font-medium">Drop Location</h3>
                          <p>Coordinates: {dropLat}, {dropLng}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Pickup Lat"
                  value={pickupLat}
                  onChange={(e) => setPickupLat(e.target.value)}
                  required
                  type="number"
                  step="any"
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <input
                  placeholder="Pickup Lng"
                  value={pickupLng}
                  onChange={(e) => setPickupLng(e.target.value)}
                  required
                  type="number"
                  step="any"
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <input
                  placeholder="Drop Lat"
                  value={dropLat}
                  onChange={(e) => setDropLat(e.target.value)}
                  required
                  type="number"
                  step="any"
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <input
                  placeholder="Drop Lng"
                  value={dropLng}
                  onChange={(e) => setDropLng(e.target.value)}
                  required
                  type="number"
                  step="any"
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
            <select value={assignedDriver} onChange={(e) => setAssignedDriver(e.target.value)} required className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand">
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
            <select value={assignedVehicle} onChange={(e) => setAssignedVehicle(e.target.value)} required className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand">
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>{v.numberPlate}</option>
              ))}
            </select>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Pickup Date & Time</label>
              <input
                type="datetime-local"
                placeholder="Select pickup date & time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <span className="text-xs text-gray-400 mt-1">Local timezone; when driver should start</span>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Expected Drop Date & Time</label>
              <input
                type="datetime-local"
                placeholder="Select expected drop date & time"
                value={dropTime}
                onChange={(e) => setDropTime(e.target.value)}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <span className="text-xs text-gray-400 mt-1">Used for conflict checks and ETA</span>
            </div>
            <button type="submit" className="bg-brand hover:bg-brand-dark text-white rounded-lg px-4 py-2">Create Delivery</button>
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...deliveries].reverse().map((d) => (
                  <tr key={d._id}>
                    <td className="px-4 py-2">#{d._id}</td>
                    <td className="px-4 py-2">{d.pickupLocation}</td>
                    <td className="px-4 py-2">{d.dropLocation}</td>
                    <td className="px-4 py-2">{d.assignedDriver?.name}</td>
                    <td className="px-4 py-2">{d.assignedVehicle?.numberPlate}</td>
                    <td className="px-4 py-2">{d.customerName}</td>
                    <td className="px-4 py-2">
                      {d.status === "pending" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{d.status}</span>}
                      {d.status === "on route" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{d.status}</span>}
                      {d.status === "delivered" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{d.status}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminDashboard;
