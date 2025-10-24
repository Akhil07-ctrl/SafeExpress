const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'driver', 'customer'],
            default: 'customer'
        },
        driverStatus: {
            type: String,
            enum: ['available', 'unavailable'],
            default: 'unavailable',
            required: function () { return this.role === 'driver'; }
        },
        vehicleTypes: {
            type: [String],
            enum: ['Tata 407', 'Ashok Leyland Ecomet', 'Mahindra Supro Maxi Truck', 'Eicher Pro 3015', 'Bharath Benz 2523R'],
            default: [],
            validate: {
                validator: function (v) {
                    return !this.role || this.role !== 'driver' || v.length > 0;
                },
                message: 'Driver must have at least one vehicle type'
            }
        },
        mobile: {
            type: String,
            required: function () { return this.role === 'driver' || this.role === 'customer'; },
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v); // Validates 10-digit mobile numbers
                },
                message: props => `${props.value} is not a valid 10-digit mobile number!`
            }
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        profilePicture: {
            type: String,
            default: 'https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg'
        }
    }, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
