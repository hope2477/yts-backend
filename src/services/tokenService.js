// src/services/tokenService.js
const crypto = require('crypto');
const db = require('../config/database');

class TokenService {
  async generateResetToken(adminId) {
    // Clear any existing tokens first
    await db.query(
      'DELETE FROM password_reset_tokens WHERE user_id = ?',
      [adminId]
    );

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 15 minutes
    
    const [result] = await db.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [adminId, token, expiresAt]
    );
    
    if (!result.affectedRows) {
      throw new Error('Failed to generate reset token');
    }
    
    return token;
  }

  async validateResetToken(token) {
    console.log('Validating token:', token);
    const [rows] = await db.query(
      `SELECT user_id FROM password_reset_tokens 
      WHERE token = ? 
      AND used = FALSE 
      AND expires_at > NOW()`,
      [token.trim()]
    );
    
    console.log('Token validation result:', rows);
    return rows[0]?.user_id;  // Changed from admin_id to user_id
  }

  async markTokenAsUsed(token) {
    const [result] = await db.query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE token = ?',
      [token.trim()]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new TokenService();