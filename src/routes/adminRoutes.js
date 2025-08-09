const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

// Controllers
const adminVehicleController = require('../controllers/adminVehicleController');
const adminPropertyController = require('../controllers/adminPropertyController');
const adminInquiryController = require('../controllers/adminInquiryController');
const adminFeatureController = require('../controllers/adminFeatureController');
const adminDashboardController = require('../controllers/adminDashboardController');

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authMiddleware.verifyToken);

// Dashboard routes
router.get('/dashboard/stats', 
  authMiddleware.requirePermission('system.view_dashboard'), 
  adminDashboardController.getDashboardStats
);
router.get('/dashboard/recent-inquiries', 
  authMiddleware.requirePermission('system.view_dashboard'), 
  adminDashboardController.getRecentInquiries
);
router.get('/dashboard/monthly-stats', 
  authMiddleware.requirePermission('system.view_reports'), 
  adminDashboardController.getMonthlyStats
);
router.get('/dashboard/popular-vehicles', 
  authMiddleware.requirePermission('system.view_dashboard'), 
  adminDashboardController.getPopularVehicles
);
router.get('/dashboard/popular-properties', 
  authMiddleware.requirePermission('system.view_dashboard'), 
  adminDashboardController.getPopularProperties
);

// Vehicle management routes
router.get('/vehicles', 
  authMiddleware.requirePermission('vehicle.view'), 
  adminVehicleController.getAllVehicles
);
router.get('/vehicles/:id', 
  authMiddleware.requirePermission('vehicle.view'), 
  adminVehicleController.getVehicleById
);
router.post('/vehicles', 
  authMiddleware.requirePermission('vehicle.create'), 
  adminVehicleController.createVehicle
);
router.put('/vehicles/:id', 
  authMiddleware.requirePermission('vehicle.update'), 
  adminVehicleController.updateVehicle
);
router.delete('/vehicles/:id', 
  authMiddleware.requirePermission('vehicle.delete'), 
  adminVehicleController.deleteVehicle
);
router.put('/vehicles/:id/availability', 
  authMiddleware.requirePermission('vehicle.manage_availability'), 
  adminVehicleController.updateVehicleAvailability
);
router.get('/vehicle-features', 
  authMiddleware.requirePermission('vehicle.view'), 
  adminVehicleController.getVehicleFeatures
);

// Property management routes
router.get('/properties', 
  authMiddleware.requirePermission('property.view'), 
  adminPropertyController.getAllProperties
);
router.get('/properties/:id', 
  authMiddleware.requirePermission('property.view'), 
  adminPropertyController.getPropertyById
);
router.post('/properties', 
  authMiddleware.requirePermission('property.create'), 
  adminPropertyController.createProperty
);
router.put('/properties/:id', 
  authMiddleware.requirePermission('property.update'), 
  adminPropertyController.updateProperty
);
router.delete('/properties/:id', 
  authMiddleware.requirePermission('property.delete'), 
  adminPropertyController.deleteProperty
);
router.put('/properties/:id/availability', 
  authMiddleware.requirePermission('property.manage_availability'), 
  adminPropertyController.updatePropertyAvailability
);
router.get('/property-features', 
  authMiddleware.requirePermission('property.view'), 
  adminPropertyController.getPropertyFeatures
);

// Inquiry management routes
router.get('/inquiries', 
  authMiddleware.requirePermission('inquiry.view'), 
  adminInquiryController.getAllInquiries
);
router.get('/inquiries/:id', 
  authMiddleware.requirePermission('inquiry.view'), 
  adminInquiryController.getInquiryById
);
router.put('/inquiries/:id/status', 
  authMiddleware.requirePermission('inquiry.update'), 
  adminInquiryController.updateInquiryStatus
);
router.delete('/inquiries/:id', 
  authMiddleware.requirePermission('inquiry.delete'), 
  adminInquiryController.deleteInquiry
);
router.get('/inquiry-stats', 
  authMiddleware.requirePermission('inquiry.view'), 
  adminInquiryController.getInquiryStats
);

// Feature management routes
router.get('/features', 
  authMiddleware.requirePermission('feature.view'), 
  adminFeatureController.getAllFeatures
);
router.get('/features/:id', 
  authMiddleware.requirePermission('feature.view'), 
  adminFeatureController.getFeatureById
);
router.post('/features', 
  authMiddleware.requirePermission('feature.create'), 
  adminFeatureController.createFeature
);
router.put('/features/:id', 
  authMiddleware.requirePermission('feature.update'), 
  adminFeatureController.updateFeature
);
router.delete('/features/:id', 
  authMiddleware.requirePermission('feature.delete'), 
  adminFeatureController.deleteFeature
);

module.exports = router;