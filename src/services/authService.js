// src/services/authService.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const authRepository = require('../repositories/authRepository');
const jwtService = require('./jwtService');
const tokenService = require('./tokenService')
const { loadEmailTemplate } = require('../helpers/emailTemplateHelper');
const emailHelper = require('../helpers/emailHelper');

const INVITE_TTL_MS = 24 * 60 * 60 * 1000;

function isStrongPassword(value) {
  return (
    typeof value === 'string' &&
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /[0-9]/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

function baseUserName(email) {
  const local = String(email).split('@')[0] || 'admin';
  const cleaned = local.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
  return cleaned || 'admin';
}

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
      profileImage: admin.profileImage || null,
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

  async uniqueUserName(email) {
    const base = baseUserName(email);
    let candidate = base;
    let n = 2;
    while (await authRepository.userNameTaken(candidate)) {
      const suffix = String(n);
      candidate = `${base.slice(0, 50 - suffix.length)}${suffix}`;
      n += 1;
      if (n > 1000) throw new Error('Could not assign a username');
    }
    return candidate;
  }

  async registerAdmin(adminData, createdBy) {
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'role_id'];
    const missingFields = requiredFields.filter(field => !adminData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    if (!createdBy) throw new Error('Sign in again before creating a user.');

    const email = String(adminData.email).trim();
    if (await authRepository.emailExists(email)) {
      throw new Error('An admin with this email already exists');
    }

    const userName = await this.uniqueUserName(email);
    const password_hash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

    const dbData = {
      firstName: String(adminData.firstName).trim(),
      lastName: String(adminData.lastName).trim(),
      userName,
      email,
      phoneNumber: String(adminData.phoneNumber).trim(),
      role_id: adminData.role_id,
      password_hash,
      isActive: adminData.isActive === false ? 0 : 1,
      createdBy,
      createdDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const adminId = await authRepository.createAdmin(dbData);

    try {
      const token = await tokenService.generateResetToken(adminId, INVITE_TTL_MS);
      await this.sendWelcomeEmail(dbData, token);
    } catch (error) {
      console.error('Welcome email failed, rolling back admin:', error.message);
      try {
        await tokenService.deleteTokensForUser(adminId);
        await authRepository.deleteAdmin(adminId);
      } catch (rollbackError) {
        console.error('Admin invite rollback failed:', rollbackError.message);
        throw new Error('Could not send the set-password email. Remove the new account before trying again.');
      }
      throw new Error('Could not send the set-password email. The account was not created.');
    }

    return adminId;
  }

  async sendWelcomeEmail(adminData, token) {
    const role = await authRepository.getRoleById(adminData.role_id);
    const roleName = role ? role.name : 'Admin';
    const base = (process.env.FRONTEND_URL || 'https://www.ytsenterprise.com').replace(/\/$/, '');
    const setPasswordUrl = `${base}/admin/sign-in?token=${encodeURIComponent(token)}`;

    const emailBody = loadEmailTemplate('admin-welcome.html', {
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      roleName,
      setPasswordUrl
    }, { rawKeys: ['setPasswordUrl'] });

    await emailHelper.sendEmail({
      to: adminData.email,
      subject: 'Set your YTS Enterprise admin password',
      html: emailBody
    });
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
    if (!isStrongPassword(newPassword)) {
      throw new Error('Password must be 8+ characters with upper, lower, number, and a symbol.');
    }

    const userId = await tokenService.validateResetToken(token);
    if (!userId) throw new Error('Invalid or expired reset token');

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await authRepository.updateAdminPassword(userId, passwordHash); // Make sure this uses user_id
    await tokenService.markTokenAsUsed(token);

    return { success: true };
  }

  async getProfile(adminId) {
    const admin = await authRepository.getAdminWithPermissions(adminId);
    if (!admin) throw new Error('Admin not found');
    return {
      id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      userName: admin.userName,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      role: admin.role,
      profileImage: admin.profileImage || null
    };
  }

  normalizeProfileImage(value) {
    if (value == null || value === '') return null;
    if (typeof value !== 'string' || !value.startsWith('data:image/jpeg;base64,')) {
      throw new Error('Profile photo must be a JPEG image.');
    }
    if (value.length > 200000) {
      throw new Error('Profile photo is too large.');
    }
    return value;
  }

  async updateProfile(adminId, { firstName, lastName, userName, profileImage }) {
    const nextFirst = String(firstName || '').trim();
    const nextLast = String(lastName || '').trim();
    const nextUser = String(userName || '').trim();
    if (!nextFirst || !nextLast || !nextUser) {
      throw new Error('First name, last name, and username are required');
    }
    if (!/^[a-zA-Z0-9._-]{3,50}$/.test(nextUser)) {
      throw new Error('Username must be 3–50 letters, numbers, dots, hyphens, or underscores');
    }
    if (await authRepository.userNameTaken(nextUser, adminId)) {
      throw new Error('That username is already taken');
    }
    const updated = await authRepository.updateAdminProfile(adminId, {
      firstName: nextFirst,
      lastName: nextLast,
      userName: nextUser,
      profileImage: this.normalizeProfileImage(profileImage)
    });
    if (!updated) throw new Error('Failed to update profile');
    return this.getProfile(adminId);
  }

  async changePassword(adminId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('Current password and new password are required');
    }
    if (!isStrongPassword(newPassword)) {
      throw new Error('Password must be 8+ characters with upper, lower, number, and a symbol.');
    }
    const admin = await authRepository.findAdminPasswordHash(adminId);
    if (!admin) throw new Error('Admin not found');
    const matches = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!matches) throw new Error('Current password is incorrect');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await authRepository.updateAdminPassword(adminId, passwordHash);
    return { success: true };
  }
}

module.exports = new AuthService();