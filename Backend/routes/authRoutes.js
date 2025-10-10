const express = require('express');

const { register, login, getCurrentUser, logout, forgotPassword, resetPassword, directResetPassword } = require('../controllers/authControllers');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

// List drivers (admin)
router.get('/drivers', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('_id name email');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load drivers' });
  }
});

// Get current user
router.get('/me', protect, getCurrentUser);
router.get('/logout', protect, logout);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);
router.post('/directresetpassword', directResetPassword);

module.exports = router;
