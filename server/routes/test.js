const express = require('express');
const router = express.Router();
const { sendBookingConfirmation } = require('../utils/emailService');

router.get('/test-email', async (req, res) => {
  const result = await sendBookingConfirmation(
    'nischal.basavaraju@gmail.com', // Use your real email or any test email
    {
      name: 'Test Equipment',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      status: 'Confirmed'
    },
    'Equipment'
  );
  res.json({ success: result });
});

module.exports = router;
