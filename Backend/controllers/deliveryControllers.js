const Delivery = require("../models/delivery");
const Vehicle = require("../models/vehicle");
const User = require("../models/user");

// Create delivery (Admin only)
const createDelivery = async (req, res) => {
  try {
    const {
      pickupLocation,
      dropLocation,
      pickupCords,
      dropCords,
      assignedDriver,
      assignedVehicle,
      customerName,
      customerMobile,
      pickupTime,
      dropTime,
      baseFare,
    } = req.body;

    // Check scheduling conflicts
    const start = new Date(pickupTime);
    const end = new Date(dropTime);
    // Overlap if existing.start < new.end AND existing.end > new.start (driver)
    const conflict = await Delivery.findOne({
      assignedDriver,
      $and: [
        { pickupTime: { $lt: end } },
        { dropTime: { $gt: start } },
      ],
    });

    if (conflict) {
      return res.status(400).json({ message: "Driver has a scheduling conflict" });
    }

    // Vehicle conflict check
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

    const delivery = await Delivery.create({
      pickupLocation,
      dropLocation,
      pickupCords,
      dropCords,
      assignedDriver,
      assignedVehicle,
      customerName,
      customerMobile,
      pickupTime: start,
      dropTime: end,
      baseFare,
    });

    // Update vehicle status
    await Vehicle.findByIdAndUpdate(assignedVehicle, { status: "assigned" });
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all deliveries (Admin)
const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("assignedDriver", "name email mobile")
      .populate("assignedVehicle", "numberPlate type");
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update delivery status (Driver)
const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const delivery = await Delivery.findById(id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    // Only assigned driver can update
    if (delivery.assignedDriver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    delivery.status = status;
    await delivery.save();

    // If delivery is completed, update vehicle status to available and emit socket event
    if (status === "delivered") {
      await Vehicle.findByIdAndUpdate(delivery.assignedVehicle, { status: "available" });

      // Emit socket event to customer for payment popup
      const io = req.app.get('io');
      io.emit('deliveryDelivered', {
        deliveryId: delivery._id,
        baseFare: delivery.baseFare,
        customerName: delivery.customerName,
        pickupLocation: delivery.pickupLocation,
        dropLocation: delivery.dropLocation,
      });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get deliveries for current user
const getMyDeliveries = async (req, res) => {
  try {
    const role = req.user.role;
    let filter = {};
    if (role === 'driver') {
      filter.assignedDriver = req.user._id;
    } else if (role === 'customer') {
      filter.customerName = req.user.name; // simplistic customer linkage
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const deliveries = await Delivery.find(filter)
      .populate("assignedDriver", "name email mobile")
      .populate("assignedVehicle", "numberPlate type");
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Live track stub - later to use Tracking model
const getDeliveryTrack = async (req, res) => {
  try {
    const { id } = req.params;
    // If storing historical tracking, fetch last known position
    // For now, respond with delivery status only
    const delivery = await Delivery.findById(id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json({ status: delivery.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Average delivery time per driver
const avgDeliveryTimePerDriver = async (req, res) => {
  try {
    const result = await Delivery.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: "$assignedDriver",
          avgDeliveryTime: { $avg: { $subtract: ["$dropTime", "$pickupTime"] } },
          totalDeliveries: { $sum: 1 },
        },
      },
    ]);

    // Populate driver name
    const populated = await User.populate(result, { path: "_id", select: "name" });
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Vehicle utilization
const vehicleUtilization = async (req, res) => {
  try {
    const result = await Delivery.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: "$assignedVehicle",
          deliveriesCount: { $sum: 1 },
        },
      },
    ]);

    // Populate vehicle number
    const populated = await Vehicle.populate(result, { path: "_id", select: "numberPlate type" });
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createDelivery, getAllDeliveries, updateDeliveryStatus, avgDeliveryTimePerDriver, vehicleUtilization, getMyDeliveries, getDeliveryTrack };