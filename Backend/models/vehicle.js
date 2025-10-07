const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
    {
        numberPlate: {
            type: String,
            required: true,
            unique: true,
        },
        type: {
            type: String,
            enum: ["tata 407", "ashok leyland ecomet", "mahindra supro maxi truck", "eicher pro 3015", "bharath benz 2523r"],
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['available', 'assigned', 'maintenance'],
            default: 'available',
        },
        assignedDriver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
