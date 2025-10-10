const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/user');
// Email feature removed per request

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '1h' }
    );
};

// Send token response with cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id, user.role);

    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            mobile: user.mobile
        }
    });
};

const register = async (req, res) => {
    const { name, email, password, role, secretCode, mobile } = req.body;
    try {
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Validate mobile number format for drivers and customers
        if ((role === 'driver' || role === 'customer') && !mobile?.match(/^[0-9]{10}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit mobile number'
            });
        }
        // Check if user already exists
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check secret code for admin
        if ((role || '').toLowerCase() === 'admin') {
            if (!secretCode || secretCode !== process.env.ADMIN_SECRET) {
                return res.status(400).json({ message: 'Invalid admin secret code' });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Validate mobile number for drivers and customers
        if ((role === 'driver' || role === 'customer') && !mobile) {
            return res.status(400).json({ message: 'Mobile number is required for drivers and customers' });
        }

        const userData = {
            name,
            email,
            password: hashedPassword,
            role: (role || 'customer').toLowerCase()
        };

        if (role === 'driver' || role === 'customer') {
            userData.mobile = mobile;
        }

        const user = await User.create(userData);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            mobile: user.mobile
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create and return JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Logout user
const logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Successfully logged out'
    });
};





// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            resetToken: resetToken
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing password reset'
        });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Validate new password
        if (req.body.password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
};

// Direct password reset with email verification
const directResetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Validate input
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('Direct reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    directResetPassword
};