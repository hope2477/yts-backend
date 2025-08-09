// src/services/authService.js
const bcrypt = require('bcrypt');
const authRepository = require('../repositories/authRepository');
const tokenService = require('./tokenService')
const db = require('../config/database');
const { loadEmailTemplate } = require('../helpers/emailTemplateHelper');
const emailHelper = require('../helpers/emailHelper');

class AuthService {
  async login(email, password) {
    const admin = await authRepository.findAdminByEmail(email);
  
    // Validation checks
    if (!admin) throw new Error('Admin not found');
    if (!admin.isActive) throw new Error('Account is inactive');
    
    // Password verification
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    // Return admin details (excluding password_hash)
    return {
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      isSuperAdmin: admin.isSuperAdmin,
      isActive: admin.isActive,
      userName: admin.userName
    };
  }

  async registerAdmin(adminData) {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'userName', 'email', 'password', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !adminData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Check if admin already exists
    const exists = await authRepository.adminExists(adminData.email, adminData.userName);
    if (exists) throw new Error('Admin with this email or username already exists');

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(adminData.password, saltRounds);

    // Prepare data for DB
    const dbData = {
      ...adminData,
      password_hash,
      isSuperAdmin: Boolean(adminData.isSuperAdmin),
      isActive: Boolean(adminData.isActive),
      createdBy: 1,
      createdDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    // Create admin
    return await authRepository.createAdmin(dbData);
  }

  async updateAdminStatus(adminId, isActive, updaterId) {
    // Validate admin exists
    const admin = await authRepository.getAdminById(adminId);
    if (!admin) throw new Error('Admin not found');
    
    // Prevent self-deactivation (optional)
    if (adminId === updaterId) {
      throw new Error('Cannot update your own active status');
    }
    
    // Update status
    const success = await authRepository.updateAdminStatus(
      adminId, 
      Boolean(isActive), // Ensure boolean value
      updaterId
    );
    
    if (!success) throw new Error('Failed to update admin status');
    return { ...admin, isActive: Boolean(isActive) };
  }

  async requestPasswordReset(email) {
    try {
      const admin = await authRepository.findAdminByEmail(email);
      if (!admin || !admin.isActive) return { success: true }; // Silent fail

      const token = await tokenService.generateResetToken(admin.id);
      console.log('Generated token:', token); // Debug log

      const resetLink = `${process.env.FRONTEND_URL}/admin/sign-in?token=${token}`;
      
      const emailBody = loadEmailTemplate('password-reset.html', {
        name: `${admin.firstName} ${admin.lastName}`,
        resetLink,
        expiryTime: '60 minutes'
      });

      await emailHelper.sendEmail({
        to: email,
        subject: 'Password Reset Request',
        html: emailBody
      });

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    const userId = await tokenService.validateResetToken(token); // Changed variable name for clarity
    
    console.log('This is the user id:', userId);
    if (!userId) throw new Error('Invalid or expired reset token');

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await authRepository.updateAdminPassword(userId, passwordHash); // Make sure this uses user_id
    await tokenService.markTokenAsUsed(token);

    return { success: true };
  }
}

module.exports = new AuthService();