const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema(
  {
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery', index: true, required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  }, { timestamps: true });

trackingSchema.index({ deliveryId: 1, createdAt: -1 });

module.exports = mongoose.model('Tracking', trackingSchema);

