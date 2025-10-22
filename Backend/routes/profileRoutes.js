const express = require('express');
const multer = require('multer');

const { protect } = require('../middleware/authMiddleware');
const {
    updateProfile,
    updatePassword,
    uploadProfilePicture
} = require('../controllers/profileControllers');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.put('/updateprofile', protect, updateProfile);

router.put('/updatepassword', protect, updatePassword);

router.post('/upload-profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;