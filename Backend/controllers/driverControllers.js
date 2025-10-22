const User = require('../models/user');

const updateDriverStatus = async (req, res) => {
    try {
        const { driverStatus } = req.body;
        const userId = req.user.id;

        console.log('Updating driver status:', { driverStatus, userId, userRole: req.user.role });

        // Verify user is a driver
        const driver = await User.findById(userId);
        if (!driver || driver.role !== 'driver') {
            console.log('Access denied - user is not a driver:', { userId, role: driver?.role });
            return res.status(403).json({ message: 'Access denied. User is not a driver.' });
        }

        // Update driver status
        const updatedDriver = await User.findByIdAndUpdate(
            userId,
            { driverStatus },
            { new: true }
        );

        console.log('Driver status updated successfully:', updatedDriver.driverStatus);

        res.json({
            success: true,
            driverStatus: updatedDriver.driverStatus
        });
    } catch (error) {
        console.error('Error updating driver status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDriverStatus = async (req, res) => {
    try {
        const { driverId } = req.params;
        console.log('Fetching driver status for driverId:', driverId);

        const driver = await User.findById(driverId);
        console.log('Found driver:', { id: driver?._id, role: driver?.role, status: driver?.driverStatus });

        if (!driver || driver.role !== 'driver') {
            console.log('Driver not found or not a driver');
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json({
            success: true,
            driverStatus: driver.driverStatus
        });
    } catch (error) {
        console.error('Error fetching driver status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAvailableDriversByVehicleType = async (req, res) => {
    try {
        const { vehicleType } = req.query;
        console.log('Fetching available drivers for vehicle type:', vehicleType);

        const query = {
            role: 'driver',
            driverStatus: 'available',
        };

        if (vehicleType) {
            query.vehicleTypes = vehicleType;
        }

        const drivers = await User.find(query)
            .select('name email profilePicture vehicleTypes driverStatus')
            .sort('name');

        console.log(`Found ${drivers.length} available drivers for vehicle type:`, vehicleType);

        res.json({
            success: true,
            drivers
        });
    } catch (error) {
        console.error('Error fetching available drivers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    updateDriverStatus,
    getDriverStatus,
    getAvailableDriversByVehicleType
};