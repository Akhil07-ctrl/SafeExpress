const express = require('express');

const { updateDriverStatus, getDriverStatus, getAvailableDriversByVehicleType } = require('../controllers/driverControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes - require authentication
router.put('/status', protect, updateDriverStatus);

router.get('/status/:driverId', protect, getDriverStatus);

// Get available drivers by vehicle type
router.get('/available', protect, getAvailableDriversByVehicleType);

module.exports = router;