const express = require("express");

const {
  createOrderRequest,
  getAllOrderRequests,
  getMyOrderRequests,
  approveOrderRequest,
  rejectOrderRequest,
  getPendingCount,
} = require("../controllers/orderRequestControllers");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Customer: create order request
router.post("/", protect, authorizeRoles("customer"), createOrderRequest);

// Customer: get my order requests
router.get("/my", protect, authorizeRoles("customer"), getMyOrderRequests);

// Admin: get all order requests
router.get("/", protect, authorizeRoles("admin"), getAllOrderRequests);

// Admin: get pending count
router.get("/pending/count", protect, authorizeRoles("admin"), getPendingCount);

// Admin: approve order request
router.post("/:id/approve", protect, authorizeRoles("admin"), approveOrderRequest);

// Admin: reject order request
router.post("/:id/reject", protect, authorizeRoles("admin"), rejectOrderRequest);

module.exports = router;
