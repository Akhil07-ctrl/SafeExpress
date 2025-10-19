const mongoose = require('mongoose');

const careerApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    enum: ['0-1', '1-3', '3-5', '5-10', '10+']
  },
  resume: {
    type: String, // Will store the file path or URL
    required: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CareerApplication', careerApplicationSchema);
