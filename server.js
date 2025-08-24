// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use(express.static(path.join(__dirname, 'public')));

// Update CORS to allow image loading
app.use(cors({
  origin: ['https://www.ytsenterprise.com', 'https://ytsenterprise.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Routes
const inquiryRoutes = require('./src/routes/inquiryRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const propertyRoutes = require('./src/routes/propertyRoutes');
const commonRoutes = require('./src/routes/commonRoutes');
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const holidayHomeRoutes = require('./src/routes/holidayHomeRoutes')

app.use('/api/inquiry', inquiryRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/common', commonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/holidayHome', holidayHomeRoutes)

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});