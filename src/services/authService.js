// src/services/authService.js
const bcrypt = require('bcrypt');
const authRepository = require('../repositories/authRepository');
const jwtService = require('./jwtService');
const tokenService = require('./tokenService')
const db = require('../config/database');
const { loadEmailTemplate } = require('../helpers/emailTemplateHelper');
const emailHelper = require('../helpers/emailHelper');
const passwordGenerator = require('../helpers/passwordGenerator')

class AuthService {
  async login(email, password) {
    const admin = await authRepository.findAdminByEmail(email);
  
    // Validation checks
    if (!admin) throw new Error('Admin not found');
    if (!admin.isActive) throw new Error('Account is inactive');
    
    // Password verification
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    // Get admin with permissions
    const adminWithPermissions = await authRepository.getAdminWithPermissions(admin.id);
    
    // Generate JWT token
    const token = jwtService.generateToken(adminWithPermissions);
    const refreshToken = jwtService.generateRefreshToken(admin.id);

    // Return admin details with token
    const result = {
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      role: admin.role,
      isActive: admin.isActive,
      userName: admin.userName,
      permissions: adminWithPermissions.permissions,
      token,
      refreshToken
    };

    return result;
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwtService.verifyRefreshToken(refreshToken);
      const admin = await authRepository.getAdminWithPermissions(decoded.id);
      
      if (!admin || !admin.isActive) {
        throw new Error('Invalid refresh token');
      }

      const newToken = jwtService.generateToken(admin);
      return { token: newToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async getAllAdmins() {
    return authRepository.getAllAdmins();
  }

  async registerAdmin(adminData) {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'userName', 'email', 'phoneNumber', 'role_id'];
    const missingFields = requiredFields.filter(field => !adminData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Check if admin already exists
    const exists = await authRepository.adminExists(adminData.email, adminData.userName);
    if (exists) throw new Error('Admin with this email or username already exists');

    // Generate temporary password if not provided
    let temporaryPassword = null;
    let password = adminData.password;
    
    if (!password) {
      const tempPasswordData = passwordGenerator.generateTemporaryPassword();
      temporaryPassword = tempPasswordData.password;
      password = temporaryPassword;
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Prepare data for DB
    const dbData = {
      ...adminData,
      password_hash,
      isActive: Boolean(adminData.isActive),
      createdBy: 1,
      createdDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    // Create admin
    const adminId = await authRepository.createAdmin(dbData);

    // Send welcome email with temporary password if generated
    if (temporaryPassword) {
      await this.sendWelcomeEmail(adminData, temporaryPassword);
    }

    return adminId;
  }

  async sendWelcomeEmail(adminData, temporaryPassword) {
    try {
      // Get role name
      const role = await authRepository.getRoleById(adminData.role_id);
      const roleName = role ? role.name : 'Admin';

      const loginUrl = `${process.env.FRONTEND_URL}/admin/sign-in`;
      
      const emailBody = loadEmailTemplate('admin-welcome.html', {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        userName: adminData.userName,
        roleName: roleName,
        temporaryPassword: temporaryPassword,
        loginUrl: loginUrl
      });

      await emailHelper.sendEmail({
        to: adminData.email,
        subject: 'Welcome to YTS Enterprise Admin Portal - Your Account Details',
        html: emailBody
      });

      console.log(`Welcome email sent to ${adminData.email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error here as admin creation was successful
      // Just log the error for monitoring
    }
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

  async getAllRoles() {
    return authRepository.getAllRoles();
  }

  async getRolePermissions(roleId) {
    return authRepository.getRolePermissions(roleId);
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