const express = require('express');
const multer = require('multer');

const { register, login, getCurrentUser, logout, forgotPassword, resetPassword, directResetPassword } = require('../controllers/authControllers');
const { updateProfile, updatePassword, uploadProfilePicture } = require('../controllers/profileControllers');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const User = require('../models/user');

const upload = multer({ storage: multer.memoryStorage() });

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

// Profile update routes
router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);
router.post('/upload-profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
