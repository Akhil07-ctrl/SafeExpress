const Vehicle = require("../models/vehicle.js");

// Add new vehicle (Admin only)
const addVehicle = async (req, res) => {
  try {
    const { numberPlate, type, capacity } = req.body;

    const vehicle = await Vehicle.create({
      numberPlate,
      type,
      capacity,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all vehicles
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("assignedDriver", "name email");
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vehicles for a specific driver
const getDriverVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ assignedDriver: req.user._id });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addVehicle,
  getVehicles,
  getDriverVehicles,
};