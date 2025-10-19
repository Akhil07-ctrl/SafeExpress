const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const {
  createPaymentIntent,
  confirmPayment,
  getMyPlan,
  cancelPlan,
  createDeliveryPaymentIntent,
  confirmDeliveryPayment,
  getTotalRevenue
} = require('../controllers/paymentControllers');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', protect, createPaymentIntent);

// Confirm payment and create plan
router.post('/confirm-payment', protect, confirmPayment);

// Get user's active plan
router.get('/my-plan', protect, getMyPlan);

// Cancel plan
router.post('/cancel-plan', protect, cancelPlan);

// Create delivery payment intent
router.post('/create-delivery-payment-intent', protect, createDeliveryPaymentIntent);

// Confirm delivery payment
router.post('/confirm-delivery-payment', protect, confirmDeliveryPayment);

// Get total revenue (Admin only)
router.get('/total-revenue', protect, getTotalRevenue);

module.exports = router;
