const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const Plan = require('../models/plan');
const Delivery = require('../models/delivery');

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { planType } = req.body;

    // Check if user role is allowed to purchase plans
    if (req.user.role === 'admin' || req.user.role === 'driver') {
      return res.status(403).json({ message: 'Admins and drivers are not allowed to purchase starter or professional plans' });
    }

    // Define plan prices
    const planPrices = {
      starter: 9900, // $99 in cents
      professional: 29900 // $299 in cents
    };

    if (!planPrices[planType]) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const amount = planPrices[planType];

    // Check if user already has an active plan
    const existingPlan = await Plan.findOne({ user: req.user._id, status: 'active' });
    if (existingPlan) {
      return res.status(400).json({ message: 'User already has an active plan' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
        planType
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount,
      planType
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

// Confirm payment and create plan
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, planType } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Create plan record
    const planPrices = {
      starter: 99,
      professional: 299
    };

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    const plan = new Plan({
      user: req.user._id,
      planType,
      amount: planPrices[planType],
      stripeSubscriptionId: paymentIntent.id,
      endDate
    });

    await plan.save();

    res.json({
      message: 'Payment confirmed and plan activated',
      plan: {
        planType: plan.planType,
        status: plan.status,
        amount: plan.amount,
        endDate: plan.endDate
      }
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};

// Get user's active plan
const getMyPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ user: req.user._id, status: 'active' });
    if (!plan) {
      return res.json({ plan: null });
    }

    res.json({
      plan: {
        planType: plan.planType,
        status: plan.status,
        amount: plan.amount,
        startDate: plan.startDate,
        endDate: plan.endDate
      }
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ message: 'Failed to get plan' });
  }
};

// Cancel plan
const cancelPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ user: req.user._id, status: 'active' });
    if (!plan) {
      return res.status(404).json({ message: 'No active plan found' });
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.update(plan.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    // Update plan status
    plan.status = 'cancelled';
    await plan.save();

    res.json({ message: 'Plan cancelled successfully' });
  } catch (error) {
    console.error('Cancel plan error:', error);
    res.status(500).json({ message: 'Failed to cancel plan' });
  }
};

// Create payment intent for delivery
const createDeliveryPaymentIntent = async (req, res) => {
  try {
    const { deliveryId } = req.body;

    // Find the delivery
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // Check if delivery is delivered and payment is pending
    if (delivery.status !== 'delivered' || delivery.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'Payment not required for this delivery' });
    }

    // For now, allow payment if delivery exists and is in correct state
    // TODO: Add proper customer authorization check when customerId is added to delivery model

    const amount = delivery.baseFare * 100; // Amount in INR cents

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: {
        deliveryId: delivery._id.toString(),
        userId: req.user._id.toString(),
        customerName: delivery.customerName
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount,
      deliveryId
    });
  } catch (error) {
    console.error('Delivery payment intent creation error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

// Confirm delivery payment
const confirmDeliveryPayment = async (req, res) => {
  try {
    const { paymentIntentId, deliveryId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Update delivery payment status
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    delivery.paymentStatus = 'paid';
    await delivery.save();

    // Emit socket event to admin for revenue update
    const io = req.app.get('io');
    io.emit('deliveryPaid', {
      deliveryId: delivery._id,
      amount: delivery.baseFare,
      customerName: delivery.customerName
    });

    res.json({
      message: 'Payment confirmed',
      delivery: {
        id: delivery._id,
        paymentStatus: delivery.paymentStatus,
        baseFare: delivery.baseFare
      }
    });
  } catch (error) {
    console.error('Delivery payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};

// Get total revenue from paid deliveries
const getTotalRevenue = async (req, res) => {
  try {
    const result = await Delivery.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$baseFare' },
          totalPaidDeliveries: { $sum: 1 },
        },
      },
    ]);

    const revenue = result.length > 0 ? result[0] : { totalRevenue: 0, totalPaidDeliveries: 0 };
    res.json(revenue);
  } catch (error) {
    console.error('Get total revenue error:', error);
    res.status(500).json({ message: 'Failed to get total revenue' });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getMyPlan,
  cancelPlan,
  createDeliveryPaymentIntent,
  confirmDeliveryPayment,
  getTotalRevenue,
};
