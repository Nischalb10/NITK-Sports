const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  timeout: 10000 // 10 seconds timeout
});

// Send booking confirmation email
exports.sendBookingConfirmation = async (userEmail, bookingDetails, type) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `NITK Sports - ${type} Booking Confirmation`,
      html: `
        <h1>Booking Confirmation</h1>
        <p>Your ${type} booking has been confirmed.</p>
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Item:</strong> ${bookingDetails.name}</li>
          <li><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</li>
          <li><strong>Status:</strong> ${bookingDetails.status}</li>
        </ul>
        <p>Thank you for using NITK Sports Infrastructure Management System.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send booking reminder email
exports.sendBookingReminder = async (userEmail, bookingDetails, type) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `NITK Sports - ${type} Booking Reminder`,
      html: `
        <h1>Booking Reminder</h1>
        <p>This is a reminder for your upcoming ${type} booking.</p>
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Item:</strong> ${bookingDetails.name}</li>
          <li><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</li>
        </ul>
        <p>Your booking starts in 30 minutes. Please be on time.</p>
        <p>Thank you for using NITK Sports Infrastructure Management System.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send booking status update email
exports.sendStatusUpdate = async (userEmail, bookingDetails, type) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `NITK Sports - ${type} Booking Status Update`,
      html: `
        <h1>Booking Status Update</h1>
        <p>Your ${type} booking status has been updated.</p>
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Item:</strong> ${bookingDetails.name}</li>
          <li><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</li>
          <li><strong>Status:</strong> ${bookingDetails.status}</li>
          ${bookingDetails.adminComment ? `<li><strong>Admin Comment:</strong> ${bookingDetails.adminComment}</li>` : ''}
        </ul>
        <p>Thank you for using NITK Sports Infrastructure Management System.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}; 