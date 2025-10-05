const express = require("express");
const router = express.Router();
const {
  createOrderRequest,
  getAllOrderRequests,
  getMyOrderRequests,
  approveOrderRequest,
  rejectOrderRequest,
  getPendingCount,
} = require("../controllers/orderRequestControllers");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// Customer: create order request
router.post("/", authMiddleware, authorizeRoles("customer"), createOrderRequest);

// Customer: get my order requests
router.get("/my", authMiddleware, authorizeRoles("customer"), getMyOrderRequests);

// Admin: get all order requests
router.get("/", authMiddleware, authorizeRoles("admin"), getAllOrderRequests);

// Admin: get pending count
router.get("/pending/count", authMiddleware, authorizeRoles("admin"), getPendingCount);

// Admin: approve order request
router.post("/:id/approve", authMiddleware, authorizeRoles("admin"), approveOrderRequest);

// Admin: reject order request
router.post("/:id/reject", authMiddleware, authorizeRoles("admin"), rejectOrderRequest);

module.exports = router;
