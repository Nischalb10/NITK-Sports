const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const EquipmentBooking = require('../models/EquipmentBooking');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const emailService = require('../utils/emailService');

// @route   POST /api/equipment
// @desc    Add new equipment
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, category, availability, quantity, condition } = req.body;

    const equipment = await Equipment.create({
      name,
      category,
      availability,
      quantity,
      condition
    });

    res.status(201).json({
      success: true,
      equipment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/equipment
// @desc    Get all equipment
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const equipment = await Equipment.find({});
    res.json({
      success: true,
      equipment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/equipment/:id
// @desc    Get equipment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    
    if (equipment) {
      res.json({
        success: true,
        equipment
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Equipment not found' 
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

// @route   PUT /api/equipment/:id
// @desc    Update equipment
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, category, availability, quantity, condition } = req.body;

    const equipment = await Equipment.findById(req.params.id);

    if (equipment) {
      equipment.name = name || equipment.name;
      equipment.category = category || equipment.category;
      equipment.availability = availability || equipment.availability;
      equipment.quantity = quantity || equipment.quantity;
      equipment.condition = condition || equipment.condition;
      equipment.updatedAt = Date.now();

      const updatedEquipment = await equipment.save();
      res.json({
        success: true,
        equipment: updatedEquipment
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Equipment not found' 
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

// @route   DELETE /api/equipment/:id
// @desc    Delete equipment
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (equipment) {
      await equipment.deleteOne();
      res.json({ 
        success: true, 
        message: 'Equipment removed' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Equipment not found' 
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

// @route   POST /api/equipment/book
// @desc    Book equipment
// @access  Private
router.post('/book', protect, async (req, res) => {
  try {
    const { equipmentId, quantity, startTime, endTime } = req.body;

    // Check if equipment exists
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Equipment not found' 
      });
    }

    // Check if equipment is available
    if (equipment.availability !== 'available') {
      return res.status(400).json({ 
        success: false, 
        message: `Equipment is ${equipment.availability}` 
      });
    }

    // Check if quantity is available
    if (equipment.quantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${equipment.quantity} units available` 
      });
    }

    // Create booking
    const booking = await EquipmentBooking.create({
      user: req.user._id,
      equipment: equipmentId,
      quantity,
      startTime,
      endTime,
      status: 'pending'
    });

    // Populate booking with equipment and user details
    const populatedBooking = await EquipmentBooking.findById(booking._id)
      .populate('equipment')
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

// @route   GET /api/equipment/bookings
// @desc    Get all equipment bookings
// @access  Private/Admin
router.get('/bookings/all', protect, admin, async (req, res) => {
  try {
    const bookings = await EquipmentBooking.find({})
      .populate('equipment')
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

// @route   GET /api/equipment/bookings/user
// @desc    Get user's equipment bookings
// @access  Private
router.get('/bookings/user', protect, async (req, res) => {
  try {
    const bookings = await EquipmentBooking.find({ user: req.user._id })
      .populate('equipment')
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

// @route   PUT /api/equipment/bookings/:id
// @desc    Update booking status
// @access  Private/Admin
router.put('/bookings/:id', protect, admin, async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    const booking = await EquipmentBooking.findById(req.params.id);

    if (booking) {
      booking.status = status || booking.status;
      booking.adminComment = adminComment || booking.adminComment;

      const updatedBooking = await booking.save();
      
      // Populate booking with equipment and user details
      const populatedBooking = await EquipmentBooking.findById(updatedBooking._id)
        .populate('equipment')
        .populate('user');

      // If booking is approved, update equipment quantity
      if (status === 'approved') {
        const equipment = await Equipment.findById(booking.equipment);
        if (equipment) {
          equipment.quantity -= booking.quantity;
          await equipment.save();
        }

        // Send email notification
        const user = await User.findById(booking.user);
        if (user) {
          const bookingDetails = {
            name: populatedBooking.equipment.name,
            date: populatedBooking.startTime,
            startTime: new Date(populatedBooking.startTime).toLocaleTimeString(),
            endTime: new Date(populatedBooking.endTime).toLocaleTimeString(),
            status: populatedBooking.status
          };
          
          await emailService.sendStatusUpdate(user.email, bookingDetails, 'Equipment');
        }
      }

      // If booking is returned, update equipment quantity
      if (status === 'returned') {
        const equipment = await Equipment.findById(booking.equipment);
        if (equipment) {
          equipment.quantity += booking.quantity;
          await equipment.save();
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

// @route   DELETE /api/equipment/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/bookings/:id', protect, async (req, res) => {
  try {
    const booking = await EquipmentBooking.findById(req.params.id);

    // Check if booking exists and belongs to user
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
    if (booking.status === 'approved') {
      // Return equipment quantity
      const equipment = await Equipment.findById(booking.equipment);
      if (equipment) {
        equipment.quantity += booking.quantity;
        await equipment.save();
      }
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

module.exports = router; 