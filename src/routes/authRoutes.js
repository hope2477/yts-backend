// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/register-admin', authController.registerAdmin);
router.get('/admins', 
  authMiddleware.verifyToken, 
  authMiddleware.requirePermission('admin.view'), 
  authController.getAllAdmins
);
router.put('/admin/:adminId/status', authController.updateAdminStatus);
router.get('/roles', 
  authMiddleware.verifyToken, 
  authMiddleware.requirePermission('admin.view'), 
  authController.getAllRoles
);
router.get('/roles/:roleId/permissions', 
  authMiddleware.verifyToken, 
  authMiddleware.requirePermission('admin.view'), 
  authController.getRolePermissions
);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;