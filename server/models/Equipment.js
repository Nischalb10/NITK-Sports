const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  availability: {
    type: String,
    enum: ['available', 'not available', 'under maintenance'],
    default: 'available'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment; 