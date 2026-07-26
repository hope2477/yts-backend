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

/**
 * CORS: production domains + Vercel preview/production + optional CORS_ORIGINS env
 * (comma-separated extra origins, e.g. http://localhost:3000,https://my-app.vercel.app)
 */
const staticAllowedOrigins = [
  'https://www.ytsenterprise.com',
  'https://ytsenterprise.com',
];

const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

function isOriginAllowed(origin) {
  if (!origin) return true; // non-browser / same-origin tools
  if (staticAllowedOrigins.includes(origin)) return true;
  if (envOrigins.includes(origin)) return true;
  // Vercel deployments (production + preview)
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'vercel.app' || hostname.endsWith('.vercel.app')) return true;
  } catch {
    return false;
  }
  return false;
}

app.use(cors({
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
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
const blogRoutes = require('./src/routes/blogRoutes');
const seoRoutes = require('./src/routes/seoRoutes');

app.use('/api/inquiry', inquiryRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/common', commonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/holidayHome', holidayHomeRoutes)
app.use('/api/blog', blogRoutes);
app.use('/api/seo', seoRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});