// src/controllers/authController.js
const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'Email and password are required' 
        });
      }

      const admin = await authService.login(email, password);
      res.json({ 
        success: true,
        data: admin 
      });
      
    } catch (error) {
      res.status(401).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  async registerAdmin(req, res) {
    try {
      const adminData = req.body;
      
      const adminId = await authService.registerAdmin(adminData);
      
      res.status(201).json({
        success: true,
        data: { adminId }
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateAdminStatus(req, res) {
    try {
      const { adminId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ 
          success: false,
          error: 'isActive must be a boolean value' 
        });
      }

      const updatedAdmin = await authService.updateAdminStatus(
        adminId,
        isActive,
        1
      );

      res.json({
        success: true,
        data: updatedAdmin
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      await authService.requestPasswordReset(email);
      res.json({ success: true });
    } catch (error) {
      // Return generic message (don't reveal if email exists)
      res.status(200).json({ success: true });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();