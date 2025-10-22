import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
import L from "leaflet";

import api from "../utils/api";
import { getRoute, calculateDistance, calculateFare } from "../utils/mapUtils";

const OrderRequestReviewModal = ({
    request,
    drivers,
    vehicles,
    onClose,
    onApprove,
    onReject,
}) => {
    const [assignData, setAssignData] = useState({
        assignedDriver: "",
        assignedVehicle: "",
        pickupLat: "",
        pickupLng: "",
        dropLat: "",
        dropLng: "",
        dropTime: "",
        baseFare: "",
    });
    const [rejectReason, setRejectReason] = useState("");
    const [activePoint, setActivePoint] = useState("pickup");
    const [searchPickup, setSearchPickup] = useState("");
    const [searchDrop, setSearchDrop] = useState("");
    const [driverStatuses, setDriverStatuses] = useState({});
    const [routeCoordinates, setRouteCoordinates] = useState([]);
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

    // Calculate route and fare when coordinates change
    useEffect(() => {
        const updateRouteAndFare = async () => {
            const { pickupLat, pickupLng, dropLat, dropLng } = assignData;
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

                let fare = 0;
                if (routeData) {
                    setRouteCoordinates(routeData.route);
                    setDistance(routeData.distance);
                    fare = calculateFare(routeData.distance, request.vehicleType);
                    setEstimatedFare(fare);
                } else {
                    // Fallback to straight-line distance if route calculation fails
                    setRouteCoordinates([]);
                    setDistance(straightDistance);
                    fare = calculateFare(straightDistance, request.vehicleType);
                    setEstimatedFare(fare);
                }

                // Auto-fill base fare
                setAssignData(prev => ({
                    ...prev,
                    baseFare: fare.toFixed(2)
                }));
            }
        };

        updateRouteAndFare();
    }, [assignData.pickupLat, assignData.pickupLng, assignData.dropLat, assignData.dropLng, request.vehicleType]);

    const handleClose = () => {
        setAssignData({
            assignedDriver: "",
            assignedVehicle: "",
            pickupLat: "",
            pickupLng: "",
            dropLat: "",
            dropLng: "",
            dropTime: "",
            baseFare: "",
        });
        setRejectReason("");
        setActivePoint("pickup");
        setSearchPickup("");
        setSearchDrop("");
        onClose();
    };

    const handleApprove = () => {
        onApprove(request._id, assignData);
        handleClose();
    };

    const handleReject = () => {
        onReject(request._id, rejectReason);
        handleClose();
    };

    const pinIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    const ClickSetter = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                if (activePoint === "pickup") {
                    setAssignData(prev => ({ ...prev, pickupLat: lat.toFixed(6), pickupLng: lng.toFixed(6) }));
                } else {
                    setAssignData(prev => ({ ...prev, dropLat: lat.toFixed(6), dropLng: lng.toFixed(6) }));
                }
            },
        });
        return null;
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
                    setAssignData(prev => ({ ...prev, pickupLat: lat, pickupLng: lon }));
                } else {
                    setAssignData(prev => ({ ...prev, dropLat: lat, dropLng: lon }));
                }
            } else {
                console.warn('No geocoding results found');
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Review Order Request</h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Request Details */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold text-gray-800 mb-3">
                            Request Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500">Customer:</span>
                                <p className="font-medium">{request.customerName}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Mobile:</span>
                                <p className="font-medium">{request.customerMobile}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Pickup:</span>
                                <p className="font-medium">{request.pickupLocation}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Drop:</span>
                                <p className="font-medium">{request.dropLocation}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Vehicle Type:</span>
                                <p className="font-medium capitalize">
                                    {request.vehicleType}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">Pickup Time:</span>
                                <p className="font-medium">
                                    {new Date(request.pickupTime).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Form */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">
                            Assign Resources
                        </h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign Driver *
                            </label>
                            <select
                                value={assignData.assignedDriver}
                                onChange={(e) =>
                                    setAssignData({
                                        ...assignData,
                                        assignedDriver: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                            >
                                <option value="">Select a driver</option>
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign Vehicle *
                            </label>
                            <select
                                value={assignData.assignedVehicle}
                                onChange={(e) =>
                                    setAssignData({
                                        ...assignData,
                                        assignedVehicle: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                            >
                                <option value="">Select a vehicle</option>
                                {vehicles
                                    .filter((v) => v.type === request.vehicleType)
                                    .map((vehicle) => (
                                        <option key={vehicle._id} value={vehicle._id}>
                                            {vehicle.numberPlate} - {vehicle.type} ({vehicle.status})
                                        </option>
                                    ))}
                            </select>
                        </div>
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
                            <div className="rounded-lg overflow-hidden border border-gray-200">
                                <MapContainer center={[17.385044, 78.486671]} zoom={11} className="leaflet-container">
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <ClickSetter />
                                    {routeCoordinates.length > 0 && (
                                        <Polyline
                                            positions={routeCoordinates.map(([lng, lat]) => [lat, lng])}
                                            color="#0066cc"
                                            weight={4}
                                            opacity={0.7}
                                        />
                                    )}
                                    {assignData.pickupLat && assignData.pickupLng && (
                                        <Marker icon={pinIcon} position={[Number(assignData.pickupLat), Number(assignData.pickupLng)]}>
                                            <Popup>Pickup</Popup>
                                        </Marker>
                                    )}
                                    {assignData.dropLat && assignData.dropLng && (
                                        <Marker icon={pinIcon} position={[Number(assignData.dropLat), Number(assignData.dropLng)]}>
                                            <Popup>Drop</Popup>
                                        </Marker>
                                    )}
                                </MapContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pickup Latitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={assignData.pickupLat}
                                        onChange={(e) =>
                                            setAssignData({
                                                ...assignData,
                                                pickupLat: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., 40.7128"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pickup Longitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={assignData.pickupLng}
                                        onChange={(e) =>
                                            setAssignData({
                                                ...assignData,
                                                pickupLng: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., -74.0060"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Drop Latitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={assignData.dropLat}
                                        onChange={(e) =>
                                            setAssignData({
                                                ...assignData,
                                                dropLat: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., 40.7580"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Drop Longitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={assignData.dropLng}
                                        onChange={(e) =>
                                            setAssignData({
                                                ...assignData,
                                                dropLng: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., -73.9855"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                            </div>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Base Fare (₹) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={assignData.baseFare}
                                readOnly
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Drop Time *
                            </label>
                            <input
                                type="datetime-local"
                                value={assignData.dropTime}
                                onChange={(e) =>
                                    setAssignData({
                                        ...assignData,
                                        dropTime: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                            />
                        </div>
                    </div>

                    {/* Rejection Form */}
                    <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                            Or Reject Request
                        </h4>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows="3"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleApprove}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2.5 font-medium"
                        >
                            Approve & Create Delivery
                        </button>
                        <button
                            onClick={handleReject}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2.5 font-medium"
                        >
                            Reject Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderRequestReviewModal;
