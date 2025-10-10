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
        resetPasswordExpire: Date
    }, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
