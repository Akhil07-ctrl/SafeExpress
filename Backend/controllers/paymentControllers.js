const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const Plan = require('../models/plan');

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { planType } = req.body;

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

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getMyPlan,
  cancelPlan
};
