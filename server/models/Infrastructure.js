const mongoose = require('mongoose');

const infrastructureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  availability: {
    type: String,
    enum: ['available', 'not available', 'under maintenance'],
    default: 'available'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  operatingHours: {
    open: {
      type: String,
      required: true
    },
    close: {
      type: String,
      required: true
    }
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

const Infrastructure = mongoose.model('Infrastructure', infrastructureSchema);

module.exports = Infrastructure; 