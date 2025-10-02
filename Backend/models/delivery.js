const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    pickupCords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dropCords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    customerName: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "on route", "delivered"],
      default: "pending",
    },
    pickupTime: { type: Date, required: true },
    dropTime: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);
