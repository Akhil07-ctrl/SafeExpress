const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    
        numberPlate: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['car', 'truck', 'bike', 'van'],
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
