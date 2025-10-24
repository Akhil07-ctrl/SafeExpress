
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

import Navbar from "../components/layout/navbar";
import OrderRequestForm from "../components/OrderRequestForm";
import PaymentPopup from "../components/PaymentPopup";
import { CardSkeleton, DeliveryCardSkeleton, TableSkeleton } from "../components/SkeletonLoader";
import api from "../utils/api";
import { getRoute, getBoundsForCoordinates, getStatusColor, createCustomIcon } from "../utils/mapUtils";

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
  const [mapBounds, setMapBounds] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const myCoords = myLocation ? [myLocation.lat, myLocation.lng] : null;
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  // Address expansion states
  const [expandedAddresses, setExpandedAddresses] = useState({});
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate stats
  const totalDeliveries = deliveries.length;
  const pendingCount = deliveries.filter(d => d.status === 'pending').length;
  const onRouteCount = deliveries.filter(d => d.status === 'on route').length;
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

  // Get the latest delivery with driver location
  const latestDelivery = deliveries[deliveries.length - 1];
  const latestDriverLocation = latestDelivery ? driverLocations[latestDelivery._id] : null;

  const pickupCoords = latestDelivery ? [latestDelivery.pickupCords.lat, latestDelivery.pickupCords.lng] : null;
  const dropCoords = latestDelivery ? [latestDelivery.dropCords.lat, latestDelivery.dropCords.lng] : null;

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
      setActivePlan(res.data?.plan || null);
    } catch (err) {
      console.error("No active plan found", err);
      setActivePlan(null);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchActivePlan();

    // Listen for deliveryDelivered event
    socket.on('deliveryDelivered', (data) => {
      // Show payment popup
      setShowPaymentPopup(true);
      setPaymentData(data);
    });

    return () => {
      socket.off('deliveryDelivered');
    };
  }, []);

  const getStatusColorForStroke = (status) => getStatusColor(status) || '#0066cc';

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
          if (route?.route?.length) {
            setRouteDetails(route);
          } else {
            setRouteDetails(null);
          }
        } catch (err) {
          console.error('Error calculating route:', err);
          setRouteDetails(null);
        } finally {
          setIsCalculating(false);
        }
      } else {
        setRouteDetails(null);
      }
    };

    calculateRoute();
  }, [latestDelivery, isCalculating]);

  useEffect(() => {
    if (!latestDelivery) {
      setMapBounds(null);
      return;
    }

    const coordinates = [
      { lat: latestDelivery.pickupCords.lat, lng: latestDelivery.pickupCords.lng },
      { lat: latestDelivery.dropCords.lat, lng: latestDelivery.dropCords.lng }
    ];

    if (latestDriverLocation) {
      coordinates.push({ lat: latestDriverLocation.lat, lng: latestDriverLocation.lng });
    }

    if (myLocation) {
      coordinates.push({ lat: myLocation.lat, lng: myLocation.lng });
    }

    setMapBounds(getBoundsForCoordinates(coordinates));
  }, [latestDelivery, latestDriverLocation, myLocation]);

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

  // Toggle address expansion
  const toggleAddress = (deliveryId, addressType) => {
    setExpandedAddresses(prev => ({
      ...prev,
      [deliveryId]: {
        ...prev[deliveryId],
        [addressType]: !prev[deliveryId]?.[addressType]
      }
    }));
  };

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
          <div className="bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 rounded-xl shadow p-4 mb-6">
            <h4 className="text-md font-semibold mb-2 text-indigo-900 dark:text-indigo-100">Active Plan</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <p><span className="text-gray-700 dark:text-gray-300 font-medium">Plan:</span> {activePlan?.planType ? activePlan.planType.charAt(0).toUpperCase() + activePlan.planType.slice(1) : 'N/A'}</p>
              <p><span className="text-gray-700 dark:text-gray-300 font-medium">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-medium ${activePlan?.status === 'active' ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100' : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100'}`}>{activePlan?.status || 'N/A'}</span></p>
              <p><span className="text-gray-700 dark:text-gray-300 font-medium">Start Date:</span> {activePlan?.startDate ? new Date(activePlan.startDate).toLocaleDateString() : 'N/A'}</p>
              <p><span className="text-gray-700 dark:text-gray-300 font-medium">Next Billing:</span> {activePlan?.endDate ? new Date(activePlan.endDate).toLocaleDateString() : 'N/A'}</p>
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
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl shadow p-4 mb-6">
            <h4 className="text-md font-semibold mb-2 dark:text-gray-100">Latest Delivery</h4>
            {(() => {
              const d = deliveries[deliveries.length - 1];
              return (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Pickup:</span>
                      {(() => {
                        const pickupAddress = d.pickupLocation || `${d.pickupCords.lat.toFixed(4)}, ${d.pickupCords.lng.toFixed(4)}`;
                        const isPickupExpanded = expandedAddresses[d._id]?.pickup;
                        return pickupAddress.length > 40 ? (
                          <div className="inline">
                            {isPickupExpanded ? (
                              <span>
                                {' '}{pickupAddress}
                                <button
                                  onClick={() => toggleAddress(d._id, 'pickup')}
                                  className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                                >
                                  show less ↑
                                </button>
                              </span>
                            ) : (
                              <span>
                                {' '}{pickupAddress.slice(0, 40)}...
                                <button
                                  onClick={() => toggleAddress(d._id, 'pickup')}
                                  className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                                >
                                  show more →
                                </button>
                              </span>
                            )}
                          </div>
                        ) : (
                          <span> {pickupAddress}</span>
                        );
                      })()}
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Drop:</span>
                      {(() => {
                        const dropAddress = d.dropLocation || `${d.dropCords.lat.toFixed(4)}, ${d.dropCords.lng.toFixed(4)}`;
                        const isDropExpanded = expandedAddresses[d._id]?.drop;
                        return dropAddress.length > 40 ? (
                          <div className="inline">
                            {isDropExpanded ? (
                              <span>
                                {' '}{dropAddress}
                                <button
                                  onClick={() => toggleAddress(d._id, 'drop')}
                                  className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                                >
                                  show less ↑
                                </button>
                              </span>
                            ) : (
                              <span>
                                {' '}{dropAddress.slice(0, 40)}...
                                <button
                                  onClick={() => toggleAddress(d._id, 'drop')}
                                  className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                                >
                                  show more →
                                </button>
                              </span>
                            )}
                          </div>
                        ) : (
                          <span> {dropAddress}</span>
                        );
                      })()}
                    </div>
                    <p><span className="text-gray-500 dark:text-gray-400">Driver:</span> {d.assignedDriver?.name}</p>
                    <p><span className="text-gray-500 dark:text-gray-400">Mobile:</span> {d.assignedDriver?.mobile}</p>
                    <p><span className="text-gray-500 dark:text-gray-400">Pickup Time:</span> {new Date(d.pickupTime).toLocaleString()}</p>
                    <p><span className="text-gray-500 dark:text-gray-400">Drop Time:</span> {new Date(d.dropTime).toLocaleString()}</p>
                    <p><span className="text-gray-500 dark:text-gray-400">Status:</span> {d.status}</p>
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
                        bounds={mapBounds || undefined}
                        center={mapBounds ? undefined : pickupCoords || [0, 0]}
                        zoom={mapBounds ? undefined : 13}
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

                        {myCoords && (
                          <Marker position={myCoords}>
                            <Popup>Your Location</Popup>
                          </Marker>
                        )}

                        {routeDetails?.route ? (
                          <Polyline
                            positions={routeDetails.route.map(([lng, lat]) => [lat, lng])}
                            color={getStatusColorForStroke(d.status)}
                            weight={4}
                            opacity={0.7}
                          />
                        ) : (
                          pickupCoords && dropCoords && (
                            <Polyline
                              positions={[pickupCoords, dropCoords]}
                              color={getStatusColorForStroke(d.status)}
                              weight={3}
                              opacity={0.6}
                            />
                          )
                        )}

                        {pickupCoords && (
                          <Marker
                            position={pickupCoords}
                            icon={createCustomIcon('https://cdn-icons-png.flaticon.com/512/1146/1146778.png', 25)}
                          >
                            <Popup>
                              Pickup: {d.pickupLocation || `${d.pickupCords.lat.toFixed(4)}, ${d.pickupCords.lng.toFixed(4)}`}
                            </Popup>
                          </Marker>
                        )}

                        {dropCoords && (
                          <Marker
                            position={dropCoords}
                            icon={createCustomIcon('https://cdn-icons-png.flaticon.com/512/1146/1146869.png', 25)}
                          >
                            <Popup>
                              Drop: {d.dropLocation || `${d.dropCords.lat.toFixed(4)}, ${d.dropCords.lng.toFixed(4)}`}
                            </Popup>
                          </Marker>
                        )}
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
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((d) => {
                    const pickupAddress = d.pickupLocation || `${d.pickupCords.lat.toFixed(4)}, ${d.pickupCords.lng.toFixed(4)}`;
                    const dropAddress = d.dropLocation || `${d.dropCords.lat.toFixed(4)}, ${d.dropCords.lng.toFixed(4)}`;
                    const isPickupExpanded = expandedAddresses[d._id]?.pickup;
                    const isDropExpanded = expandedAddresses[d._id]?.drop;

                    return (
                      <tr key={d._id}>
                        <td className="px-4 py-2">#{d._id.slice(-6)}</td>
                        <td className="px-4 py-2">
                          {pickupAddress.length > 40 ? (
                            <div>
                              {isPickupExpanded ? (
                                <div>
                                  {pickupAddress}
                                  <button
                                    onClick={() => toggleAddress(d._id, 'pickup')}
                                    className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                  >
                                    show less ↑
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  {pickupAddress.slice(0, 40)}...
                                  <button
                                    onClick={() => toggleAddress(d._id, 'pickup')}
                                    className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                  >
                                    show more →
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            pickupAddress
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {dropAddress.length > 40 ? (
                            <div>
                              {isDropExpanded ? (
                                <div>
                                  {dropAddress}
                                  <button
                                    onClick={() => toggleAddress(d._id, 'drop')}
                                    className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                  >
                                    show less ↑
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  {dropAddress.slice(0, 40)}...
                                  <button
                                    onClick={() => toggleAddress(d._id, 'drop')}
                                    className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                  >
                                    show more →
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            dropAddress
                          )}
                        </td>
                        <td className="px-4 py-2">{d.assignedDriver?.name}</td>
                        <td className="px-4 py-2">{d.assignedDriver?.mobile}</td>
                        <td className="px-4 py-2">{d.assignedVehicle?.numberPlate}</td>
                        <td className="px-4 py-2">
                          <>
                            {d.status === "pending" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{d.status}</span>}
                            {d.status === "on route" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{d.status}</span>}
                            {d.status === "delivered" && (
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{d.status}</span>
                                {d.paymentStatus === "paid" ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setShowPaymentPopup(true);
                                      setPaymentData({
                                        deliveryId: d._id,
                                        customerName: user?.name,
                                        amount: d.baseFare || 0
                                      });
                                    }}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                                  >
                                    Pay Now
                                  </button>
                                )}
                              </div>
                            )}
                          </>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {deliveries.length > 1 && deliveries.length - 1 > itemsPerPage && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, deliveries.length - 1)}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, deliveries.length - 1)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{deliveries.length - 1}</span>{' '}
                  results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil((deliveries.length - 1) / itemsPerPage)))}
                  disabled={currentPage === Math.ceil((deliveries.length - 1) / itemsPerPage)}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Payment Popup */}
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          deliveryData={paymentData}
          onPaymentSuccess={() => {
            setShowPaymentPopup(false);
            setPaymentData(null);
            fetchDeliveries(); // Refresh deliveries to show updated payment status
          }}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;
