const User = require('../models/user');

const updateDriverStatus = async (req, res) => {
    try {
        const { driverStatus } = req.body;
        const userId = req.user.id;

        // Verify user is a driver
        const driver = await User.findById(userId);
        if (!driver || driver.role !== 'driver') {
            return res.status(403).json({ message: 'Access denied. User is not a driver.' });
        }

        // Update driver status
        const updatedDriver = await User.findByIdAndUpdate(
            userId,
            { driverStatus },
            { new: true }
        );

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
        const driver = await User.findById(driverId);

        if (!driver || driver.role !== 'driver') {
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

module.exports = {
    updateDriverStatus,
    getDriverStatus
};