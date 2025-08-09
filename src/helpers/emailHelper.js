const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Configure the transporter with your Namecheap email service details
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., 'mail.ytsenterprise.com'
  port: process.env.EMAIL_PORT, // e.g., 465 for SSL
  secure: process.env.EMAIL_PORT == 465, // true for port 465 (SSL), false otherwise
  auth: {
    user: process.env.EMAIL_USER, // Your email (e.g., info@ytsenterprise.com)
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Function to send an email
exports.sendEmail = async ({ to, subject, html }) => {
  try {
    console.log(`Attempting to send email to: ${to}`);

    await transporter.sendMail({
      from: `"YTS Enterprise" <${process.env.EMAIL_USER}>`, // Sender address
      to, // Recipient email
      subject, // Subject line
      html, // HTML body content
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error; // Rethrow to handle errors at a higher level
  }
};
