const mongoose = require('mongoose');

const infrastructureBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  infrastructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Infrastructure',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  adminComment: {
    type: String,
    default: ''
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only book one slot per day
infrastructureBookingSchema.index({ user: 1, date: 1 }, { unique: true });

const InfrastructureBooking = mongoose.model('InfrastructureBooking', infrastructureBookingSchema);

module.exports = InfrastructureBooking; 