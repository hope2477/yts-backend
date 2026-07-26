// server.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const PORT = process.env.PORT || 3000;
/** Bump when deploying so you can verify Namecheap picked up this file. */
const CORS_BUILD = '2026-07-26-vercel';

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * CORS: production domains + any *.vercel.app + CORS_ORIGINS (comma-separated).
 * Sets Access-Control-Allow-Origin to the request Origin (not a hardcoded www URL).
 */
const staticAllowedOrigins = new Set([
  'https://www.ytsenterprise.com',
  'https://ytsenterprise.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
envOrigins.forEach((o) => staticAllowedOrigins.add(o));

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (staticAllowedOrigins.has(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'vercel.app' || hostname.endsWith('.vercel.app')) return true;
  } catch {
    return false;
  }
  return false;
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Prove which build answered (survives if LiteSpeed only overwrites ACAO)
  res.setHeader('X-Yts-Cors-Build', CORS_BUILD);

  if (origin && isOriginAllowed(origin)) {
    // Must echo the request origin when credentials are used (cannot use *)
    res.removeHeader('Access-Control-Allow-Origin');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,DELETE,OPTIONS,PATCH'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  return next();
});

// Quick deploy check: GET /api/health → should show corsBuild + echo Origin if allowed
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    corsBuild: CORS_BUILD,
    requestOrigin: req.headers.origin || null,
    allowVercel: true,
  });
});

// Routes
const inquiryRoutes = require('./src/routes/inquiryRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const propertyRoutes = require('./src/routes/propertyRoutes');
const commonRoutes = require('./src/routes/commonRoutes');
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const holidayHomeRoutes = require('./src/routes/holidayHomeRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const seoRoutes = require('./src/routes/seoRoutes');

app.use('/api/inquiry', inquiryRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/common', commonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/holidayHome', holidayHomeRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/seo', seoRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (corsBuild=${CORS_BUILD})`);
});
