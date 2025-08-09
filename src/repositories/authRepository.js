// src/repositories/authRepository.js
const db = require('../config/database');

class AuthRepository {
  async findAdminByEmail(email) {
    const [rows] = await db.query(
      `SELECT 
        a.id,
        a.firstName,
        a.lastName,
        a.email,
        a.password_hash,
        a.phoneNumber,
        a.userName,
        a.isActive,
        a.role_id,
        r.name as role
       FROM admin 
       LEFT JOIN roles r ON a.role_id = r.id
       WHERE a.email = ?`,
      [email]
    );
    return rows[0];
  }

  async getAdminWithPermissions(adminId) {
    // Get admin with role
    const [adminRows] = await db.query(
      `SELECT 
        a.id,
        a.firstName,
        a.lastName,
        a.email,
        a.phoneNumber,
        a.userName,
        a.isActive,
        a.role_id,
        r.name as role
       FROM admin a
       LEFT JOIN roles r ON a.role_id = r.id
       WHERE a.id = ?`,
      [adminId]
    );

    if (!adminRows[0]) return null;

    const admin = adminRows[0];

    // Get permissions for this admin's role
    const [permissionRows] = await db.query(
      `SELECT DISTINCT p.id, p.code, p.name, p.description, p.module
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = ? AND p.isActive = 1`,
      [admin.role_id]
    );

    admin.permissions = permissionRows;
    return admin;
  }

  async getAllAdmins() {
    const [rows] = await db.query(
      `SELECT 
        a.id,
        a.firstName,
        a.lastName,
        a.email,
        a.phoneNumber,
        a.userName,
        a.isActive,
        a.role_id,
        r.name as role,
        a.createdDate,
        a.updatedDate
       FROM admin a
       LEFT JOIN roles r ON a.role_id = r.id
       ORDER BY a.createdDate DESC`
    );
    return rows;
  }

  async createAdmin(adminData) {
    const [result] = await db.query(
      `INSERT INTO admin 
      (firstName, lastName, userName, email, password_hash, phoneNumber, role_id, isActive, createdBy, createdDate) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminData.firstName,
        adminData.lastName,
        adminData.userName,
        adminData.email,
        adminData.password_hash,
        adminData.phoneNumber,
        adminData.role_id,
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
      `SELECT 
        a.id, 
        a.firstName, 
        a.lastName, 
        a.email, 
        a.isActive,
        a.role_id,
        r.name as role
      FROM admin a
      LEFT JOIN roles r ON a.role_id = r.id
      WHERE a.id = ?`,
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

  async getAllRoles() {
    const [rows] = await db.query(
      'SELECT id, name, description FROM roles WHERE isActive = 1 ORDER BY name'
    );
    return rows;
  }

  async getRolePermissions(roleId) {
    const [rows] = await db.query(
      `SELECT p.id, p.code, p.name, p.description, p.module
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = ? AND p.isActive = 1
       ORDER BY p.module, p.name`,
      [roleId]
    );
    return rows;
  }
}

module.exports = new AuthRepository();