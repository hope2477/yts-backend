const db = require('../config/database');

class HolidayHomeRepository {
  // Returns holiday home availability by ID
  async getHolidayHomeAvailabilityByID(id) {
    try {
      const [result] = await db.query(
        'SELECT id, holidayHomeId, startDate, endDate, createdBy, createdDate, updatedBy, updatedDate FROM holidayHomeAvailability WHERE holidayHomeId = ? ORDER BY startDate',
        [id]
      );

      // Return empty array if no records found
      if (!result || result.length === 0) {
        return { data: [] };
      }

      return { data: result };

    } catch (error) {
      console.error('Error fetching holiday home availability:', error.message);
      throw new Error('Unable to retrieve holiday home availability');
    }
  }

  // Update holiday home availability - completely replace all records
  async updateHolidayHomeAvailability(holidayHomeId, availability, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // 1. Delete all existing availability for this holiday home
      await connection.query(
        'DELETE FROM holidayHomeAvailability WHERE holidayHomeId = ?',
        [holidayHomeId]
      );
      
      // 2. Insert new availability records if provided
      if (availability && availability.length > 0) {
        const availabilityValues = availability.map(avail => [
          holidayHomeId,
          avail.startDate,
          avail.endDate || null, // endDate can be null
          userId,
          new Date() // createdDate
        ]);
        
        await connection.query(`
          INSERT INTO holidayHomeAvailability 
          (holidayHomeId, startDate, endDate, createdBy, createdDate) 
          VALUES ?
        `, [availabilityValues]);
      }
      
      await connection.commit();
      
      // 3. Return the updated availability
      const updatedAvailability = await this.getHolidayHomeAvailabilityByID(holidayHomeId);
      
      return {
        success: true,
        data: updatedAvailability.data
      };
      
    } catch (error) {
      await connection.rollback();
      console.error('Error updating holiday home availability:', error.message);
      throw new Error('Unable to update holiday home availability');
    } finally {
      connection.release();
    }
  }
}

module.exports = new HolidayHomeRepository();