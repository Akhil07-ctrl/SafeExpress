import L from 'leaflet';

// Constants for fare calculation
export const BASE_RATES = {
    'tata 407': 15, // ₹15 per km
    'ashok leyland ecomet': 18, // ₹18 per km
    'mahindra supro maxi truck': 12, // ₹12 per km
    'eicher pro 3015': 20, // ₹20 per km
    'bharath benz 2523r': 25 // ₹25 per km
};

export const MIN_FARE = {
    'tata 407': 300,
    'ashok leyland ecomet': 400,
    'mahindra supro maxi truck': 250,
    'eicher pro 3015': 500,
    'bharath benz 2523r': 600
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Convert degrees to radians
const toRad = (degrees) => {
    return degrees * (Math.PI / 180);
};

// Calculate estimated fare based on distance and vehicle type
export const calculateFare = (distance, vehicleType) => {
    if (!distance || !vehicleType) return 0;

    const baseRate = BASE_RATES[vehicleType.toLowerCase()] || 10;
    const minFare = MIN_FARE[vehicleType.toLowerCase()] || 100;

    const calculatedFare = Math.ceil(distance * baseRate);
    return Math.max(calculatedFare, minFare);
};

// Fetch route between two points using OSRM
export const getRoute = async (startLat, startLng, endLat, endLng) => {
    try {
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.code !== 'Ok') {
            throw new Error('Unable to find route');
        }

        return {
            route: data.routes[0].geometry.coordinates,
            distance: data.routes[0].distance / 1000, // Convert meters to kilometers
            duration: Math.round(data.routes[0].duration / 60) // Convert seconds to minutes
        };
    } catch (error) {
        console.error('Error fetching route:', error);
        return null;
    }
};

// Get bounds that include all coordinates
export const getBoundsForCoordinates = (coordinates) => {
    if (!coordinates || coordinates.length === 0) return null;

    const bounds = coordinates.reduce((acc, coord) => {
        return {
            minLat: Math.min(acc.minLat, coord.lat),
            maxLat: Math.max(acc.maxLat, coord.lat),
            minLng: Math.min(acc.minLng, coord.lng),
            maxLng: Math.max(acc.maxLng, coord.lng),
        };
    }, {
        minLat: coordinates[0].lat,
        maxLat: coordinates[0].lat,
        minLng: coordinates[0].lng,
        maxLng: coordinates[0].lng,
    });

    // Add some padding
    const latPadding = (bounds.maxLat - bounds.minLat) * 0.1;
    const lngPadding = (bounds.maxLng - bounds.minLng) * 0.1;

    return [
        [bounds.minLat - latPadding, bounds.minLng - lngPadding],
        [bounds.maxLat + latPadding, bounds.maxLng + lngPadding],
    ];
};

// Get marker color based on delivery status
export const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return '#FFA500'; // Orange
        case 'on route':
            return '#0066CC'; // Blue
        case 'delivered':
            return '#00CC00'; // Green
        default:
            return '#808080'; // Gray
    }
};

// Create a custom icon for the marker
export const createCustomIcon = (iconUrl, size = 30) => {
    return L.icon({
        iconUrl,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size]
    });
};