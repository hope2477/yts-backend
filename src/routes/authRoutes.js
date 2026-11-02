// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/register-admin', 
  authMiddleware.verifyToken, 
  authMiddleware.requirePermission('admin.create'), 
  authController.registerAdmin
);
router.get('/admins', 
  authMiddleware.verifyToken, 
  authMiddleware.requirePermission('admin.view'), 
  authController.getAllAdmins
);
router.post('/admin/:adminId/resend-invite',
  authMiddleware.verifyToken,
  authMiddleware.requirePermission('admin.create'),
  authController.resendInvite
);
router.put('/admin/:adminId/status',
  authMiddleware.verifyToken, 
  authMiddleware.requirePermission('admin.view'), 
  authController.updateAdminStatus
);
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
router.get('/profile',
  authMiddleware.verifyToken,
  authController.getProfile
);
router.put('/profile',
  authMiddleware.verifyToken,
  authController.updateProfile
);
router.put('/change-password',
  authMiddleware.verifyToken,
  authController.changePassword
);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;