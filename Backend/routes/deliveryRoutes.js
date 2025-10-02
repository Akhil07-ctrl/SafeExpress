const express = require("express");
const router = express.Router();
const {
  createDelivery,
  getAllDeliveries,
  updateDeliveryStatus, 
  avgDeliveryTimePerDriver,
  vehicleUtilization,
  getMyDeliveries,
  getDeliveryTrack
} = require("../controllers/deliveryControllers");
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

// Admin: create delivery
router.post("/", authMiddleware, authorizeRoles("admin"), createDelivery);

// Admin: get all deliveries
router.get("/", authMiddleware, authorizeRoles("admin"), getAllDeliveries);

// Driver and Customer: my deliveries
router.get("/my", authMiddleware, getMyDeliveries);

// Driver: update delivery status
router.put("/:id/status", authMiddleware, authorizeRoles("driver"), updateDeliveryStatus);

router.get("/reports/driver-time", authMiddleware, authorizeRoles("admin"), avgDeliveryTimePerDriver);

router.get("/reports/vehicle-utilization", authMiddleware, authorizeRoles("admin"), vehicleUtilization);

// Live tracking REST
router.get("/:id/track", authMiddleware, getDeliveryTrack);

module.exports = router;
