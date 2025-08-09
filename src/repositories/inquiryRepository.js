const db = require('../config/database');

class InquiryRepository {
    /**
     * Save inquiry details to the database.
     * @param {Object} inquiryData
     * @returns {Promise<number>} inquiryID
     */
    async saveInquiry(inquiryData) {
        try {
            const query = `
                INSERT INTO inquiry (
                    name, email, contactNumber, message, status, remarks, rentalTypeID, vehicleID,
                    holidayHomeID, propertyID, updatedDate, updatedBy, startDate, endDate
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                inquiryData.updatedDate,
                inquiryData.updatedBy,
                inquiryData.startDate,
                inquiryData.endDate,
            ];

            const [result] = await db.query(query, values);

            return result.insertId; // Return the ID of the newly inserted inquiry
        } catch (error) {
            console.error('Error saving inquiry to the database:', error.message, error.stack);
            throw new Error('Database operation failed while saving inquiry.');
        }
    }
}

module.exports = new InquiryRepository();
