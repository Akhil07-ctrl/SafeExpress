import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

import api from "../utils/api";
import { calculateDistance, calculateFare, getRoute } from "../utils/mapUtils";

const OrderRequestForm = ({ user, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerMobile: user?.mobile || "",
    pickupLocation: "",
    dropLocation: "",
    vehicleType: "",
    pickupTime: "",
    pickupLat: "",
    pickupLng: "",
    dropLat: "",
    dropLng: "",
  });

  const [distance, setDistance] = useState(0);
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [activePoint, setActivePoint] = useState("pickup"); // "pickup" or "drop"
  const [searchPickup, setSearchPickup] = useState("");
  const [searchDrop, setSearchDrop] = useState("");
  const [loading, setLoading] = useState(false);

  // Memoize updateRouteAndFare function
  const updateRouteAndFare = useCallback(async () => {
    const { pickupLat, pickupLng, dropLat, dropLng, vehicleType } = formData;
    if (pickupLat && pickupLng && dropLat && dropLng) {
      // Calculate straight-line distance
      const straightDistance = calculateDistance(
        parseFloat(pickupLat),
        parseFloat(pickupLng),
        parseFloat(dropLat),
        parseFloat(dropLng)
      );

      // Get actual route
      const routeData = await getRoute(
        parseFloat(pickupLat),
        parseFloat(pickupLng),
        parseFloat(dropLat),
        parseFloat(dropLng)
      );

      if (routeData) {
        setRouteCoordinates(routeData.route);
        setDistance(routeData.distance);
        setEstimatedFare(calculateFare(routeData.distance, vehicleType));
      } else {
        // Fallback to straight-line distance if route calculation fails
        setRouteCoordinates([]);
        setDistance(straightDistance);
        setEstimatedFare(calculateFare(straightDistance, vehicleType));
      }
    }
  }, [formData]);

  // Update route and fare when coordinates or vehicle type change
  useEffect(() => {
    updateRouteAndFare();
  }, [formData.pickupLat, formData.pickupLng, formData.dropLat, formData.dropLng, formData.vehicleType, updateRouteAndFare]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const geocode = async (query, type) => {
    if (!query) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        if (type === 'pickup') {
          setFormData(prev => ({
            ...prev,
            pickupLat: lat.toString(),
            pickupLng: lng.toString(),
            pickupLocation: data[0].display_name
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            dropLat: lat.toString(),
            dropLng: lng.toString(),
            dropLocation: data[0].display_name
          }));
        }
      } else {
        toast.warning('Location not found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Error finding location');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        customerName: formData.customerName,
        customerMobile: formData.customerMobile,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        vehicleType: formData.vehicleType,
        pickupTime: formData.pickupTime,
      };

      await api.post("/order-requests", requestData);
      toast.success("Order request submitted successfully!");
      setIsOpen(false);
      setFormData({
        customerName: user?.name || "",
        customerMobile: "",
        pickupLocation: "",
        dropLocation: "",
        vehicleType: "truck",
        pickupTime: "",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit order request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-brand hover:bg-brand-dark text-white rounded-lg px-6 py-3 font-medium shadow-md transition-all"
      >
        + Request New Order
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">New Order Request</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile *
                    </label>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      name="customerMobile"
                      value={formData.customerMobile}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>

                {/* Map and Location Selection */}
                <div className="space-y-4">
                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setActivePoint("pickup")}
                      className={`px-4 py-2 rounded-lg ${activePoint === "pickup"
                          ? "bg-brand text-white"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      Set Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePoint("drop")}
                      className={`px-4 py-2 rounded-lg ${activePoint === "drop"
                          ? "bg-brand text-white"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      Set Drop
                    </button>
                  </div>

                  {/* Search bars */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search pickup location"
                        value={searchPickup}
                        onChange={(e) => setSearchPickup(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <button
                        type="button"
                        onClick={() => geocode(searchPickup, "pickup")}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                      >
                        Find
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search drop location"
                        value={searchDrop}
                        onChange={(e) => setSearchDrop(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <button
                        type="button"
                        onClick={() => geocode(searchDrop, "drop")}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                      >
                        Find
                      </button>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="h-[400px] rounded-lg overflow-hidden border border-gray-300">
                    <MapContainer
                      center={[17.385044, 78.486671]}
                      zoom={11}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                      {formData.pickupLat && formData.pickupLng && (
                        <Marker
                          position={[
                            parseFloat(formData.pickupLat),
                            parseFloat(formData.pickupLng),
                          ]}
                        >
                          <Popup>Pickup Location</Popup>
                        </Marker>
                      )}

                      {formData.dropLat && formData.dropLng && (
                        <Marker
                          position={[
                            parseFloat(formData.dropLat),
                            parseFloat(formData.dropLng),
                          ]}
                        >
                          <Popup>Drop Location</Popup>
                        </Marker>
                      )}

                      {routeCoordinates.length > 0 && (
                        <Polyline
                          positions={routeCoordinates.map(([lng, lat]) => [lat, lng])}
                          color="#0066cc"
                          weight={4}
                          opacity={0.7}
                        />
                      )}
                    </MapContainer>
                  </div>

                  {distance > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">
                        Distance: {distance.toFixed(1)} km
                      </p>
                      {estimatedFare > 0 && (
                        <p className="text-gray-600">
                          Estimated Fare: ₹{estimatedFare}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Other form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type *
                    </label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="mini">Mini</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="tempo">Tempo</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderRequestForm;
