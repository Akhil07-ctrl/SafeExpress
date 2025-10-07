const express = require("express");

const {
  createDelivery,
  getAllDeliveries,
  updateDeliveryStatus,
  avgDeliveryTimePerDriver,
  vehicleUtilization,
  getMyDeliveries,
  getDeliveryTrack
} = require("../controllers/deliveryControllers");
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin: create delivery
router.post("/", protect, authorizeRoles("admin"), createDelivery);

// Admin: get all deliveries
router.get("/", protect, authorizeRoles("admin"), getAllDeliveries);

// Driver and Customer: my deliveries
router.get("/my", protect, getMyDeliveries);

// Driver: update delivery status
router.put("/:id/status", protect, authorizeRoles("driver"), updateDeliveryStatus);

router.get("/reports/driver-time", protect, authorizeRoles("admin"), avgDeliveryTimePerDriver);

router.get("/reports/vehicle-utilization", protect, authorizeRoles("admin"), vehicleUtilization);

// Live tracking REST
router.get("/:id/track", protect, getDeliveryTrack);

module.exports = router;
