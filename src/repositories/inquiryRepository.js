const db = require('../config/database');

class InquiryRepository {
    async getAllInquiriesForAdmin({ page, limit, status, rentalType, startDate, endDate }) {
        try {
            let baseQuery = `
            FROM inquiry i
            JOIN rentalType rt ON i.rentalTypeID = rt.id
            LEFT JOIN vehicle v ON i.vehicleID = v.id
            LEFT JOIN property p ON i.propertyID = p.id
            WHERE 1=1
            `;

            const params = [];

            if (status) {
            baseQuery += ' AND i.status = ?';
            params.push(status);
            }

            if (rentalType) {
            baseQuery += ' AND rt.name = ?';
            params.push(rentalType);
            }

            if (startDate && endDate) {
            baseQuery += ' AND i.createdDate BETWEEN ? AND ?';
            params.push(startDate, endDate);
            }

            // Count total records
            const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
            const [countResult] = await db.query(countQuery, params);
            const total = countResult[0].total;

            // Select only needed columns for the table view
            let dataQuery = `
            SELECT 
                i.id, 
                i.name, 
                i.email,
                i.contactNumber, 
                i.createdDate,
                i.startDate,
                i.endDate,
                rt.name as rentalTypeName,
                CASE 
                    WHEN i.vehicleID IS NOT NULL THEN CONCAT(v.make, ' ', v.model, ' (', v.numberPlate, ')')
                    WHEN i.propertyID IS NOT NULL THEN p.name
                    WHEN i.holidayHomeID IS NOT NULL THEN 'Holiday Home'
                    ELSE 'Unknown'
                END as rentalName,
                i.status,
                i.updatedDate,
                i.remarks,
                i.message
            ${baseQuery}
            ORDER BY i.createdDate DESC
            LIMIT ? OFFSET ?
            `;
            
            params.push(limit, (page - 1) * limit);

            const [rows] = await db.query(dataQuery, params);

            return {
            data: rows,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
            };
        } catch (error) {
            console.error('Error fetching inquiries for admin:', error.message);
            throw new Error('Unable to retrieve inquiries');
        }
        }

    async getInquiryByIdForAdmin(id) {
        try {
            const [rows] = await db.query(`
                SELECT i.*, rt.name as rentalTypeName,
                    CASE 
                        WHEN i.vehicleID IS NOT NULL THEN CONCAT(v.make, ' ', v.model)
                        WHEN i.propertyID IS NOT NULL THEN p.name
                        WHEN i.holidayHomeID IS NOT NULL THEN 'Holiday Home'
                        ELSE 'Unknown'
                    END as rentalName,
                    v.NumberPlate as vehicleNumberPlate
                FROM inquiry i
                JOIN rentalType rt ON i.rentalTypeID = rt.id
                LEFT JOIN vehicle v ON i.vehicleID = v.id
                LEFT JOIN property p ON i.propertyID = p.id
                WHERE i.id = ?
            `, [id]);

            return rows[0] || null;
        } catch (error) {
            console.error('Error fetching inquiry by ID for admin:', error.message);
            throw new Error('Unable to retrieve inquiry');
        }
    }

    async updateInquiryStatus(id, status, remarks, userId) {
        try {
            const [result] = await db.query(
                `UPDATE inquiry 
                 SET status = ?, remarks = ?, updatedBy = ?, updatedDate = NOW()
                 WHERE id = ?`,
                [status, remarks, userId, id]
            );
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating inquiry status:', error.message);
            throw new Error('Unable to update inquiry status');
        }
    }

    async deleteInquiry(id) {
        try {
            const [result] = await db.query('DELETE FROM inquiry WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting inquiry:', error.message);
            throw new Error('Unable to delete inquiry');
        }
    }

    async getInquiryStats() {
        try {
            const pendingSql = `LOWER(TRIM(status)) = 'pending'`;
            const closedSql = `LOWER(TRIM(status)) IN ('done', 'approved', 'completed', 'rejected')`;

            const [totalCount] = await db.query('SELECT COUNT(*) as count FROM inquiry');
            const [pendingCount] = await db.query(
                `SELECT COUNT(*) as count FROM inquiry WHERE ${pendingSql}`
            );
            const [completedCount] = await db.query(
                `SELECT COUNT(*) as count FROM inquiry WHERE ${closedSql}`
            );
            const [monthlyCount] = await db.query(`
                SELECT COUNT(*) as count
                FROM inquiry
                WHERE createdDate IS NOT NULL
                  AND MONTH(createdDate) = MONTH(CURRENT_DATE())
                  AND YEAR(createdDate) = YEAR(CURRENT_DATE())
            `);

            return {
                total: Number(totalCount[0].count) || 0,
                pending: Number(pendingCount[0].count) || 0,
                completed: Number(completedCount[0].count) || 0,
                monthly: Number(monthlyCount[0].count) || 0
            };
        } catch (error) {
            console.error('Error fetching inquiry stats:', error.message);
            throw new Error('Unable to retrieve inquiry statistics');
        }
    }

    /**
     * Save inquiry details to the database.
     * @param {Object} inquiryData
     * @returns {Promise<number>} inquiryID
     */
    async saveInquiry(inquiryData) {
        try {
            const now = inquiryData.createdDate || inquiryData.updatedDate || new Date();
            const query = `
                INSERT INTO inquiry (
                    name, email, contactNumber, message, status, remarks, rentalTypeID, vehicleID,
                    holidayHomeID, propertyID, createdDate, updatedDate, updatedBy, startDate, endDate
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                inquiryData.name,
                inquiryData.email,
                inquiryData.contactNumber,
                inquiryData.message,
                inquiryData.status,
                inquiryData.remarks,
                inquiryData.rentalTypeID,
                inquiryData.vehicleID,
                inquiryData.holidayHomeID,
                inquiryData.propertyID,
                now,
                inquiryData.updatedDate || now,
                inquiryData.updatedBy,
                inquiryData.startDate,
                inquiryData.endDate,
            ];

            const [result] = await db.query(query, values);

            return result.insertId;
        } catch (error) {
            console.error('Error saving inquiry to the database:', error.message, error.stack);
            throw new Error('Database operation failed while saving inquiry.');
        }
    }
}

module.exports = new InquiryRepository();
