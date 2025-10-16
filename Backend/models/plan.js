const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    planType: {
      type: String,
      enum: ['starter', 'professional'],
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    amount: {
      type: Number,
      required: true
    },
    stripeSubscriptionId: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
