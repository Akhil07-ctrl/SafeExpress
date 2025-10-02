const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authControllers');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// List drivers (admin)
router.get('/drivers', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('_id name email');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load drivers' });
  }
});
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
