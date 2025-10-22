const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

const User = require('../models/user');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const { name, mobile, vehicleTypes } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = name || user.name;
    user.mobile = mobile || user.mobile;
    if (user.role === 'driver' && vehicleTypes) {
        user.vehicleTypes = vehicleTypes;
    }

    const updatedUser = await user.save();

    res.json({
        user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile || '',
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,
            vehicleTypes: updatedUser.vehicleTypes || []
        }
    });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
});

// @desc    Upload profile picture
// @route   POST /api/auth/upload-profile-picture
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    try {
        // Convert buffer to base64
        const base64String = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64String}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'safeexpress/profile-pictures',
            public_id: `user-${user._id}`,
            overwrite: true,
            transformation: [
                { width: 400, height: 400, crop: "fill" },
                { quality: "auto" }
            ]
        });

        // Update user profile picture URL
        user.profilePicture = result.secure_url;
        await user.save();

        res.json({
            message: 'Profile picture uploaded successfully',
            profilePicture: result.secure_url
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500);
        throw new Error('Error uploading profile picture');
    }
});

module.exports = {
    updateProfile,
    updatePassword,
    uploadProfilePicture
};