const db = require('../config/database');

class FeatureRepository {
  async getAllFeatures(rentalType, search) {
    try {
      let query = `
        SELECT f.id, f.name, f.rentalId, f.isActive, f.createdDate, f.updatedDate,
               rt.name as rentalTypeName
        FROM feature f
        JOIN rentalType rt ON f.rentalId = rt.id
        WHERE 1=1
      `;
      
      const params = [];
      
      if (rentalType) {
        query += ' AND rt.name = ?';
        params.push(rentalType);
      }
      
      if (search) {
        query += ' AND f.name LIKE ?';
        params.push(`%${search}%`);
      }
      
      query += ' ORDER BY rt.name, f.name';
      
      const [rows] = await db.query(query, params);
      return rows.map(row => ({
        ...row,
        isActive: Boolean(row.isActive)
      }));
    } catch (error) {
      console.error('Error fetching features:', error.message);
      throw new Error('Unable to retrieve features');
    }
  }

  async getFeatureById(id) {
    try {
      const [rows] = await db.query(
        `SELECT f.id, f.name, f.rentalId, f.isActive, f.createdDate, f.updatedDate,
                rt.name as rentalTypeName
         FROM feature f
         JOIN rentalType rt ON f.rentalId = rt.id
         WHERE f.id = ?`,
        [id]
      );
      
      if (rows.length === 0) return null;
      
      return {
        ...rows[0],
        isActive: Boolean(rows[0].isActive)
      };
    } catch (error) {
      console.error('Error fetching feature by ID:', error.message);
      throw new Error('Unable to retrieve feature');
    }
  }

  async createFeature(featureData) {
    try {
      const [result] = await db.query(
        `INSERT INTO feature (name, rentalId, isActive, createdBy, createdDate)
         VALUES (?, ?, ?, ?, NOW())`,
        [
          featureData.name,
          featureData.rentalId,
          featureData.isActive !== undefined ? featureData.isActive : true,
          featureData.createdBy
        ]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating feature:', error.message);
      throw new Error('Unable to create feature');
    }
  }

  async updateFeature(id, updateData) {
    try {
      const [result] = await db.query(
        `UPDATE feature 
         SET name = ?, rentalId = ?, isActive = ?, updatedBy = ?, updatedDate = NOW()
         WHERE id = ?`,
        [
          updateData.name,
          updateData.rentalId,
          updateData.isActive,
          updateData.updatedBy,
          id
        ]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating feature:', error.message);
      throw new Error('Unable to update feature');
    }
  }

  async deleteFeature(id, userId) {
    try {
      const [result] = await db.query(
        `UPDATE feature 
         SET isActive = 0, updatedBy = ?, updatedDate = NOW()
         WHERE id = ?`,
        [userId, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting feature:', error.message);
      throw new Error('Unable to delete feature');
    }
  }
}

module.exports = new FeatureRepository();