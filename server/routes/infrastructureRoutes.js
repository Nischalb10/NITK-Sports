const express = require('express');
const router = express.Router();
const Infrastructure = require('../models/Infrastructure');
const InfrastructureBooking = require('../models/InfrastructureBooking');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const emailService = require('../utils/emailService');

// @route   POST /api/infrastructure
// @desc    Add new infrastructure
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, location, availability, capacity, operatingHours } = req.body;

    const infrastructure = await Infrastructure.create({
      name,
      location,
      availability,
      capacity,
      operatingHours
    });

    res.status(201).json({
      success: true,
      infrastructure
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/infrastructure
// @desc    Get all infrastructure
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const infrastructure = await Infrastructure.find({});
    res.json({
      success: true,
      infrastructure
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/infrastructure/:id
// @desc    Get infrastructure by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findById(req.params.id);
    
    if (infrastructure) {
      res.json({
        success: true,
        infrastructure
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Infrastructure not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/infrastructure/:id
// @desc    Update infrastructure
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, location, availability, capacity, operatingHours } = req.body;

    const infrastructure = await Infrastructure.findById(req.params.id);

    if (infrastructure) {
      infrastructure.name = name || infrastructure.name;
      infrastructure.location = location || infrastructure.location;
      infrastructure.availability = availability || infrastructure.availability;
      infrastructure.capacity = capacity || infrastructure.capacity;
      
      if (operatingHours) {
        infrastructure.operatingHours = operatingHours;
      }
      
      infrastructure.updatedAt = Date.now();

      const updatedInfrastructure = await infrastructure.save();
      res.json({
        success: true,
        infrastructure: updatedInfrastructure
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Infrastructure not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/infrastructure/:id
// @desc    Delete infrastructure
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findById(req.params.id);

    if (infrastructure) {
      await infrastructure.deleteOne();
      res.json({ 
        success: true, 
        message: 'Infrastructure removed' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Infrastructure not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   POST /api/infrastructure/book
// @desc    Book infrastructure
// @access  Private
router.post('/book', protect, async (req, res) => {
  try {
    const { infrastructureId, date, startTime, endTime } = req.body;

    // Check if infrastructure exists
    const infrastructure = await Infrastructure.findById(infrastructureId);
    if (!infrastructure) {
      return res.status(404).json({ 
        success: false, 
        message: 'Infrastructure not found' 
      });
    }

    // Check if infrastructure is available
    if (infrastructure.availability !== 'available') {
      return res.status(400).json({ 
        success: false, 
        message: `Infrastructure is ${infrastructure.availability}` 
      });
    }

    // Check if user already has a booking for this date
    const existingBooking = await InfrastructureBooking.findOne({
      user: req.user._id,
      date: new Date(date).toISOString().split('T')[0]
    });

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a booking for this date' 
      });
    }

    // Check if slot is available
    const slotBooked = await InfrastructureBooking.findOne({
      infrastructure: infrastructureId,
      date: new Date(date).toISOString().split('T')[0],
      startTime,
      endTime,
      status: { $in: ['pending', 'approved'] }
    });

    if (slotBooked) {
      return res.status(400).json({ 
        success: false, 
        message: 'This slot is already booked' 
      });
    }

    // Create booking
    const booking = await InfrastructureBooking.create({
      user: req.user._id,
      infrastructure: infrastructureId,
      date: new Date(date),
      startTime,
      endTime,
      status: 'pending'
    });

    // Populate booking with infrastructure and user details
    const populatedBooking = await InfrastructureBooking.findById(booking._id)
      .populate('infrastructure')
      .populate('user');

    res.status(201).json({
      success: true,
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/infrastructure/bookings
// @desc    Get all infrastructure bookings
// @access  Private/Admin
router.get('/bookings/all', protect, admin, async (req, res) => {
  try {
    const bookings = await InfrastructureBooking.find({})
      .populate('infrastructure')
      .populate('user', '-password');

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/infrastructure/bookings/user
// @desc    Get user's infrastructure bookings
// @access  Private
router.get('/bookings/user', protect, async (req, res) => {
  try {
    const bookings = await InfrastructureBooking.find({ user: req.user._id })
      .populate('infrastructure')
      .populate('user', '-password');

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/infrastructure/bookings/date/:date
// @desc    Get infrastructure bookings by date
// @access  Private
router.get('/bookings/date/:date', protect, async (req, res) => {
  try {
    const date = new Date(req.params.date).toISOString().split('T')[0];
    
    const bookings = await InfrastructureBooking.find({
      date: new Date(date),
      status: { $in: ['pending', 'approved'] }
    })
      .populate('infrastructure')
      .populate('user', '-password');

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/infrastructure/bookings/:id
// @desc    Update booking status
// @access  Private/Admin
router.put('/bookings/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    const booking = await InfrastructureBooking.findById(req.params.id);

    if (booking) {
      booking.status = status || booking.status;
      booking.adminComment = adminComment || booking.adminComment;

      const updatedBooking = await booking.save();
      
      // Populate booking with infrastructure and user details
      const populatedBooking = await InfrastructureBooking.findById(updatedBooking._id)
        .populate('infrastructure')
        .populate('user');

      // Send email notification
      if (status === 'approved' || status === 'rejected') {
        const user = await User.findById(booking.user);
        if (user) {
          const infrastructure = await Infrastructure.findById(booking.infrastructure);
          const bookingDetails = {
            name: infrastructure.name,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            status: booking.status,
            adminComment: booking.adminComment
          };
          
          await emailService.sendStatusUpdate(user.email, bookingDetails, 'Infrastructure');
        }
      }

      res.json({
        success: true,
        booking: populatedBooking
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/infrastructure/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/bookings/:id', protect, async (req, res) => {
  try {
    const booking = await InfrastructureBooking.findById(req.params.id);

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check if booking belongs to user or user is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Check if booking can be cancelled
    const currentDate = new Date();
    const bookingDate = new Date(booking.date);
    
    if (bookingDate < currentDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel past bookings' 
      });
    }

    await booking.deleteOne();
    res.json({ 
      success: true, 
      message: 'Booking cancelled' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/infrastructure/bookings/reminder
// @desc    Send reminder for upcoming bookings
// @access  Private/Admin
router.get('/bookings/reminder', protect, admin, async (req, res) => {
  try {
    const currentDate = new Date();
    const thirtyMinutesLater = new Date(currentDate.getTime() + 30 * 60000);
    
    // Find bookings that are 30 minutes away and reminder not sent
    const bookings = await InfrastructureBooking.find({
      date: currentDate.toISOString().split('T')[0],
      status: 'approved',
      reminderSent: false
    })
      .populate('infrastructure')
      .populate('user');

    console.log(`Found ${bookings.length} bookings for today that need reminders`);
    
    if (bookings.length === 0) {
      return res.json({
        success: true,
        message: 'No upcoming bookings found that need reminders'
      });
    }

    let remindersSent = 0;
    let errors = [];

    for (const booking of bookings) {
      const bookingTime = booking.startTime.split(':');
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(parseInt(bookingTime[0]), parseInt(bookingTime[1]));
      
      // Check if booking is within 30 minutes
      const timeDiff = (bookingDate.getTime() - currentDate.getTime()) / 60000;
      
      if (timeDiff <= 30 && timeDiff > 0) {
        // Send reminder
        const bookingDetails = {
          name: booking.infrastructure.name,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime
        };
        
        try {
          const emailSent = await emailService.sendBookingReminder(
            booking.user.email,
            bookingDetails,
            'Infrastructure'
          );
          
          if (emailSent) {
            booking.reminderSent = true;
            await booking.save();
            remindersSent++;
            console.log(`Reminder sent to ${booking.user.email} for ${booking.infrastructure.name}`);
          } else {
            errors.push(`Failed to send reminder to ${booking.user.email}`);
          }
        } catch (emailError) {
          console.error('Email error:', emailError);
          errors.push(`Error sending to ${booking.user.email}: ${emailError.message}`);
        }
      } else {
        console.log(`Booking for ${booking.infrastructure.name} is not within reminder window (${timeDiff.toFixed(2)} minutes away)`);
      }
    }

    res.json({
      success: true,
      message: `${remindersSent} reminders sent`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Reminder endpoint error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;