import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { toast } from "react-toastify";

import api from "../utils/api";
import { createCustomIcon, calculateDistance, calculateFare } from "../utils/mapUtils";
import { validateDeliveryForm } from "../utils/validation";

const AdminCreateDeliveryModal = ({ isOpen, onClose, onSuccess, drivers, vehicles }) => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    pickupLat: "",
    pickupLng: "",
    dropLat: "",
    dropLng: "",
    assignedDriver: "",
    assignedVehicle: "",
    customerName: "",
    customerMobile: "",
    pickupTime: "",
    dropTime: "",
  });
  const [activePoint, setActivePoint] = useState("pickup");
  const [searchPickup, setSearchPickup] = useState("");
  const [searchDrop, setSearchDrop] = useState("");
  const [loading, setLoading] = useState(false);
  const [driverStatuses, setDriverStatuses] = useState({});
  const [distance, setDistance] = useState(0);
  const [estimatedFare, setEstimatedFare] = useState(0);


  // Fetch driver statuses
  const fetchDriverStatuses = useCallback(async () => {
    if (!drivers.length) return;

    try {
      const statusPromises = drivers.map(driver =>
        api.get(`/drivers/status/${driver._id}`)
          .then(res => res.data.driverStatus)
          .catch(() => 'unavailable')
      );
      const statuses = {};
      const results = await Promise.all(statusPromises);
      drivers.forEach((driver, index) => {
        statuses[driver._id] = results[index];
      });
      setDriverStatuses(statuses);
    } catch (err) {
      console.error('Error fetching driver statuses:', err);
    }
  }, [drivers]);

  // Initial fetch and set up periodic refresh
  useEffect(() => {
    if (drivers.length > 0) {
      fetchDriverStatuses();

      // Set up periodic refresh
      const intervalId = setInterval(fetchDriverStatuses, 10000); // Refresh every 10 seconds

      // Cleanup interval on unmount or when drivers change
      return () => clearInterval(intervalId);
    }
  }, [drivers, fetchDriverStatuses]);

  // Calculate distance when pickup/drop coordinates change
  useEffect(() => {
    if (formData.pickupLat && formData.pickupLng && formData.dropLat && formData.dropLng) {
      const pickupCoords = { lat: Number(formData.pickupLat), lng: Number(formData.pickupLng) };
      const dropCoords = { lat: Number(formData.dropLat), lng: Number(formData.dropLng) };

      const dist = calculateDistance(pickupCoords.lat, pickupCoords.lng, dropCoords.lat, dropCoords.lng);
      setDistance(dist);
    }
  }, [formData.pickupLat, formData.pickupLng, formData.dropLat, formData.dropLng]);

  // Calculate fare when distance and vehicle are set
  useEffect(() => {
    if (distance > 0 && formData.assignedVehicle) {
      const selectedVehicle = vehicles.find(v => v._id === formData.assignedVehicle);
      if (selectedVehicle) {
        const fare = calculateFare(distance, selectedVehicle.type);
        setEstimatedFare(fare);
      }
    }
  }, [distance, formData.assignedVehicle, vehicles]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const geocode = async (query, which) => {
    if (!query) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat).toFixed(6);
        const lon = parseFloat(data[0].lon).toFixed(6);
        if (which === 'pickup') {
          setFormData(prev => ({ ...prev, pickupLat: lat, pickupLng: lon }));
        } else {
          setFormData(prev => ({ ...prev, dropLat: lat, dropLng: lon }));
        }
      } else {
        console.warn('No geocoding results found');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const errors = validateDeliveryForm(formData);
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => toast.error(error));
      setLoading(false);
      return;
    }

    try {
      await api.post("/deliveries", {
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        pickupCords: { lat: Number(formData.pickupLat), lng: Number(formData.pickupLng) },
        dropCords: { lat: Number(formData.dropLat), lng: Number(formData.dropLng) },
        assignedDriver: formData.assignedDriver,
        assignedVehicle: formData.assignedVehicle,
        customerName: formData.customerName,
        customerMobile: formData.customerMobile,
        pickupTime: formData.pickupTime,
        dropTime: formData.dropTime,
      });
      toast.success("Delivery created successfully!");
      setFormData({
        pickupLocation: "",
        dropLocation: "",
        pickupLat: "",
        pickupLng: "",
        dropLat: "",
        dropLng: "",
        assignedDriver: "",
        assignedVehicle: "",
        customerName: "",
        customerMobile: "",
        pickupTime: "",
        dropTime: "",
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err.response?.data?.message || "Error creating delivery");
      toast.error(err.response?.data?.message || "Error creating delivery");
    } finally {
      setLoading(false);
    }
  };

  const ClickSetter = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (activePoint === "pickup") {
          setFormData(prev => ({ ...prev, pickupLat: lat.toFixed(6), pickupLng: lng.toFixed(6) }));
        } else {
          setFormData(prev => ({ ...prev, dropLat: lat.toFixed(6), dropLng: lng.toFixed(6) }));
        }
      },
    });
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Create Delivery</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              placeholder="Pickup Location"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              placeholder="Drop Location"
              name="dropLocation"
              value={formData.dropLocation}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              placeholder="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              placeholder="Customer Mobile"
              name="customerMobile"
              value={formData.customerMobile}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <select
              name="assignedDriver"
              value={formData.assignedDriver}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option
                  key={driver._id}
                  value={driver._id}
                  className={driverStatuses[driver._id] === 'available' ? 'text-green-700' : 'text-red-700'}
                  disabled={driverStatuses[driver._id] !== 'available'}
                >
                  {driver.name} ({driverStatuses[driver._id] === 'available' ? '✓ Available' : '× Not Available'})
                </option>
              ))}
            </select>
            <select
              name="assignedVehicle"
              value={formData.assignedVehicle}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.numberPlate} - {vehicle.type} ({vehicle.status ? 'Active' : 'Inactive'})
                </option>
              ))}
            </select>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Pickup Date & Time</label>
              <input
                type="datetime-local"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Expected Drop Date & Time</label>
              <input
                type="datetime-local"
                name="dropTime"
                value={formData.dropTime}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
          <div className="space-y-3">
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
                {formData.pickupLat && formData.pickupLng && (
                  <Marker
                    icon={createCustomIcon('https://cdn-icons-png.flaticon.com/512/1146/1146778.png', 25)}
                    position={[Number(formData.pickupLat), Number(formData.pickupLng)]}
                  >
                    <Popup>
                      <div className="text-sm">
                        <h3 className="font-medium">Pickup Location</h3>
                        <p>Coordinates: {formData.pickupLat}, {formData.pickupLng}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
                {formData.dropLat && formData.dropLng && (
                  <Marker
                    icon={createCustomIcon('https://cdn-icons-png.flaticon.com/512/1146/1146869.png', 25)}
                    position={[Number(formData.dropLat), Number(formData.dropLng)]}
                  >
                    <Popup>
                      <div className="text-sm">
                        <h3 className="font-medium">Drop Location</h3>
                        <p>Coordinates: {formData.dropLat}, {formData.dropLng}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Pickup Lat"
                name="pickupLat"
                value={formData.pickupLat}
                onChange={handleChange}
                required
                type="number"
                step="any"
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <input
                placeholder="Pickup Lng"
                name="pickupLng"
                value={formData.pickupLng}
                onChange={handleChange}
                required
                type="number"
                step="any"
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <input
                placeholder="Drop Lat"
                name="dropLat"
                value={formData.dropLat}
                onChange={handleChange}
                required
                type="number"
                step="any"
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <input
                placeholder="Drop Lng"
                name="dropLng"
                value={formData.dropLng}
                onChange={handleChange}
                required
                type="number"
                step="any"
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            {distance > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="text-lg font-semibold text-gray-900">{distance.toFixed(2)} km</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Estimated Fare</p>
                    <p className="text-lg font-semibold text-green-600">₹{estimatedFare.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Delivery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateDeliveryModal;
