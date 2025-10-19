const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const CareerApplication = require('../models/careerApplication');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
  }
});

// POST /api/careers - Submit career application
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, position, experience, coverLetter } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !position || !experience || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Create new career application
    const careerApplication = new CareerApplication({
      name,
      email,
      phone,
      position,
      experience,
      resume: req.file.path, // Store file path
      coverLetter: coverLetter || ''
    });

    await careerApplication.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: {
        id: careerApplication._id,
        status: careerApplication.status
      }
    });
  } catch (error) {
    console.error('Error submitting career application:', error);

    // Clean up uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.'
    });
  }
});

// GET /api/careers - Get all career applications (admin only)
router.get('/', async (req, res) => {
  try {
    const applications = await CareerApplication.find()
      .sort({ appliedAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching career applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

// GET /api/careers/:id - Get specific application
router.get('/:id', async (req, res) => {
  try {
    const application = await CareerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching career application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application'
    });
  }
});

// PUT /api/careers/:id/status - Update application status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const application = await CareerApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
});

module.exports = router;
