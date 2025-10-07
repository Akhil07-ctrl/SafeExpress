const express = require("express");

const { addVehicle, getVehicles, getDriverVehicles } = require("../controllers/vehicleControllers");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin: add vehicle
router.post("/", protect, authorizeRoles("admin"), addVehicle);

// Admin: view all vehicles
router.get("/", protect, authorizeRoles("admin"), getVehicles);

// Driver: view assigned vehicles
router.get("/my", protect, authorizeRoles("driver"), getDriverVehicles);

module.exports = router;
