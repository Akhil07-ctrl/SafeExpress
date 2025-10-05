const mongoose = require("mongoose");

const orderRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: { type: String, required: true },
    customerMobile: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    pickupCords: {
      lat: { type: Number },
      lng: { type: Number },
    },
    dropCords: {
      lat: { type: Number },
      lng: { type: Number },
    },
    vehicleType: {
      type: String,
      enum: ["truck", "van", "bike"],
      required: true,
    },
    pickupTime: { type: Date, required: true },
    dropTime: { type: Date },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderRequest", orderRequestSchema);
