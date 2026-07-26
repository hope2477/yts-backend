const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const LOGO_CID = 'yts-logo@ytsenterprise.com';
const LOGO_PATH = path.join(__dirname, '../assets/yts-logo.png');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_PORT == 465,
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 30000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter
  .verify()
  .then(() => {
    console.log('Email transporter verified and ready');
  })
  .catch((err) => {
    console.warn('Email transporter verify failed (sends may still work):', err.message);
  });

function getLogoAttachment() {
  if (!fs.existsSync(LOGO_PATH)) return null;
  return {
    filename: 'yts-logo.png',
    path: LOGO_PATH,
    cid: LOGO_CID,
    contentDisposition: 'inline',
    contentType: 'image/png',
  };
}

exports.LOGO_CID = LOGO_CID;

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    console.log(`Attempting to send email to: ${to}`);

    const logoAttachment = getLogoAttachment();
    const mailOptions = {
      from: `"YTS Enterprise" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    if (logoAttachment) {
      mailOptions.attachments = [logoAttachment];
    }

    await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

/** Logs failures without throwing — for background / fire-and-forget sends */
exports.sendEmailSafe = async ({ to, subject, html }) => {
  try {
    await exports.sendEmail({ to, subject, html });
  } catch (error) {
    console.error(`Background email failed to ${to}:`, error.message);
  }
};
