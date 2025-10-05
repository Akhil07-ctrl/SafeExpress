const OrderRequest = require("../models/orderRequest");
const Delivery = require("../models/delivery");
const Vehicle = require("../models/vehicle");
const User = require("../models/user");

// Get io instance
let io;
const getIO = () => {
  if (!io) {
    const server = require("../index");
    io = server.io;
  }
  return io;
};

// Create order request (Customer only)
const createOrderRequest = async (req, res) => {
  try {
    const {
      customerName,
      customerMobile,
      pickupLocation,
      dropLocation,
      vehicleType,
      pickupTime,
    } = req.body;

    // Validate customer
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can create order requests" });
    }

    const orderRequest = await OrderRequest.create({
      customerId: req.user._id,
      customerName,
      customerMobile,
      pickupLocation,
      dropLocation,
      vehicleType,
      pickupTime: new Date(pickupTime),
    });

    // Emit Socket.IO event for real-time notification
    try {
      const socketIO = getIO();
      socketIO.to('orderRequests').emit('orderRequestCreated', orderRequest);
    } catch (err) {
      console.error('Failed to emit socket event:', err.message);
    }

    res.status(201).json(orderRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all order requests (Admin only)
const getAllOrderRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const orderRequests = await OrderRequest.find(filter)
      .populate("customerId", "name email")
      .populate("deliveryId")
      .sort({ createdAt: -1 });
    
    res.json(orderRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my order requests (Customer only)
const getMyOrderRequests = async (req, res) => {
  try {
    const orderRequests = await OrderRequest.find({ customerId: req.user._id })
      .populate("deliveryId")
      .sort({ createdAt: -1 });
    
    res.json(orderRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve order request and create delivery (Admin only)
const approveOrderRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedDriver, assignedVehicle, pickupCords, dropCords, dropTime } = req.body;

    const orderRequest = await OrderRequest.findById(id);
    if (!orderRequest) {
      return res.status(404).json({ message: "Order request not found" });
    }

    if (orderRequest.status !== "pending") {
      return res.status(400).json({ message: "Order request already processed" });
    }

    // Validate required coordinates and drop time
    if (!pickupCords || !dropCords || !dropTime) {
      return res.status(400).json({ message: "Pickup coordinates, drop coordinates, and drop time are required" });
    }

    // Check scheduling conflicts
    const start = new Date(orderRequest.pickupTime);
    const end = new Date(dropTime);
    
    const driverConflict = await Delivery.findOne({
      assignedDriver,
      $and: [
        { pickupTime: { $lt: end } },
        { dropTime: { $gt: start } },
      ],
    });

    if (driverConflict) {
      return res.status(400).json({ message: "Driver has a scheduling conflict" });
    }

    const vehicleConflict = await Delivery.findOne({
      assignedVehicle,
      $and: [
        { pickupTime: { $lt: end } },
        { dropTime: { $gt: start } },
      ],
    });

    if (vehicleConflict) {
      return res.status(400).json({ message: "Vehicle has a scheduling conflict" });
    }

    // Create delivery
    const delivery = await Delivery.create({
      pickupLocation: orderRequest.pickupLocation,
      dropLocation: orderRequest.dropLocation,
      pickupCords,
      dropCords,
      assignedDriver,
      assignedVehicle,
      customerName: orderRequest.customerName,
      pickupTime: start,
      dropTime: end,
    });

    // Update order request with coordinates and drop time
    orderRequest.pickupCords = pickupCords;
    orderRequest.dropCords = dropCords;
    orderRequest.dropTime = end;

    // Update vehicle status
    await Vehicle.findByIdAndUpdate(assignedVehicle, { status: "assigned" });

    // Update order request
    orderRequest.status = "approved";
    orderRequest.deliveryId = delivery._id;
    await orderRequest.save();

    const populatedRequest = await OrderRequest.findById(id)
      .populate("customerId", "name email")
      .populate("deliveryId");

    // Emit Socket.IO event for real-time notification
    try {
      const socketIO = getIO();
      socketIO.to('orderRequests').emit('orderRequestStatusChanged', populatedRequest);
    } catch (err) {
      console.error('Failed to emit socket event:', err.message);
    }

    res.json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject order request (Admin only)
const rejectOrderRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const orderRequest = await OrderRequest.findById(id);
    if (!orderRequest) {
      return res.status(404).json({ message: "Order request not found" });
    }

    if (orderRequest.status !== "pending") {
      return res.status(400).json({ message: "Order request already processed" });
    }

    orderRequest.status = "rejected";
    orderRequest.rejectionReason = rejectionReason || "No reason provided";
    await orderRequest.save();

    const populatedRequest = await OrderRequest.findById(id)
      .populate("customerId", "name email");

    // Emit Socket.IO event for real-time notification
    try {
      const socketIO = getIO();
      socketIO.to('orderRequests').emit('orderRequestStatusChanged', populatedRequest);
    } catch (err) {
      console.error('Failed to emit socket event:', err.message);
    }

    res.json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending order requests count (Admin only)
const getPendingCount = async (req, res) => {
  try {
    const count = await OrderRequest.countDocuments({ status: "pending" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrderRequest,
  getAllOrderRequests,
  getMyOrderRequests,
  approveOrderRequest,
  rejectOrderRequest,
  getPendingCount,
};
