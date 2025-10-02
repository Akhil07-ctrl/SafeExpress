const express = require("express");
const router = express.Router();
const { addVehicle, getVehicles, getDriverVehicles } = require("../controllers/vehicleControllers");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// Admin: add vehicle
router.post("/", authMiddleware, authorizeRoles("admin"), addVehicle);

// Admin: view all vehicles
router.get("/", authMiddleware, authorizeRoles("admin"), getVehicles);

// Driver: view assigned vehicles
router.get("/my", authMiddleware, authorizeRoles("driver"), getDriverVehicles);

module.exports = router;
