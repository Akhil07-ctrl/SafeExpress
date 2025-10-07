const express = require('express');

const { updateDriverStatus, getDriverStatus } = require('../controllers/driverControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes - require authentication
router.put('/status', protect, updateDriverStatus);

router.get('/status/:driverId', protect, getDriverStatus);

module.exports = router;