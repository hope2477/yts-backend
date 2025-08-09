// src/repositories/authRepository.js
const db = require('../config/database');

class AuthRepository {
  async findAdminByEmail(email) {
    const [rows] = await db.query(
      `SELECT 
        id,
        firstName,
        lastName,
        email,
        password_hash,
        phoneNumber,
        isSuperAdmin,
        userName,
        isActive
       FROM admin 
       WHERE email = ?`,
      [email]
    );
    return rows[0];
  }

  async createAdmin(adminData) {
    const [result] = await db.query(
      `INSERT INTO admin 
      (firstName, lastName, userName, email, password_hash, phoneNumber, isSuperAdmin, isActive, createdBy, createdDate) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminData.firstName,
        adminData.lastName,
        adminData.userName,
        adminData.email,
        adminData.password_hash,
        adminData.phoneNumber,
        adminData.isSuperAdmin,
        adminData.isActive,
        adminData.createdBy,
        adminData.createdDate
      ]
    );
    return result.insertId;
  }

  async adminExists(email, userName) {
    const [rows] = await db.query(
      `SELECT 1 FROM admin WHERE email = ? OR userName = ? LIMIT 1`,
      [email, userName]
    );
    return rows.length > 0;
  }  
  
  async updateAdminStatus(adminId, isActive, updatedBy) {
    const [result] = await db.query(
      `UPDATE admin 
      SET isActive = ?, updatedBy = ?, updatedDate = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [isActive, updatedBy, adminId]
    );
    return result.affectedRows > 0;
  }

  async getAdminById(adminId) {
    const [rows] = await db.query(
      `SELECT id, firstName, lastName, email, isSuperAdmin, isActive 
      FROM admin WHERE id = ?`,
      [adminId]
    );
    return rows[0];
  }

  async updateAdminPassword(userId, passwordHash) {
    const [result] = await db.query(
      'UPDATE admin SET password_hash = ? WHERE id = ?',
      [passwordHash, userId]  // Changed to use id instead of email
    );
    return result.affectedRows > 0;
  }
}

module.exports = new AuthRepository();