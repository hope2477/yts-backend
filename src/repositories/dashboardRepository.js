const db = require('../config/database');

class DashboardRepository {
  async getDashboardStats() {
    try {
      // Get total counts
      const [vehicleCount] = await db.query('SELECT COUNT(*) as count FROM vehicle WHERE isActive = 1');
      const [propertyCount] = await db.query('SELECT COUNT(*) as count FROM property WHERE isActive = 1');
      const [inquiryCount] = await db.query('SELECT COUNT(*) as count FROM inquiry');
      const [pendingInquiryCount] = await db.query('SELECT COUNT(*) as count FROM inquiry WHERE status = "Pending"');
      
      // Get this month's inquiries
      const [monthlyInquiries] = await db.query(`
        SELECT COUNT(*) as count 
        FROM inquiry 
        WHERE MONTH(updatedDate) = MONTH(CURRENT_DATE()) 
        AND YEAR(updatedDate) = YEAR(CURRENT_DATE())
      `);

      return {
        totalVehicles: vehicleCount[0].count,
        totalProperties: propertyCount[0].count,
        totalInquiries: inquiryCount[0].count,
        pendingInquiries: pendingInquiryCount[0].count,
        monthlyInquiries: monthlyInquiries[0].count
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error.message);
      throw new Error('Unable to retrieve dashboard statistics');
    }
  }

  async getRecentInquiries(limit) {
    try {
      const [rows] = await db.query(`
        SELECT i.id, i.name, i.email, i.contactNumber, i.message, i.status, 
               i.updatedDate, rt.name as rentalType,
               CASE 
                 WHEN i.vehicleID IS NOT NULL THEN CONCAT(v.make, ' ', v.model)
                 WHEN i.propertyID IS NOT NULL THEN p.name
                 WHEN i.holidayHomeID IS NOT NULL THEN 'Holiday Home'
                 ELSE 'Unknown'
               END as rentalName
        FROM inquiry i
        JOIN rentalType rt ON i.rentalTypeID = rt.id
        LEFT JOIN vehicle v ON i.vehicleID = v.id
        LEFT JOIN property p ON i.propertyID = p.id
        ORDER BY i.updatedDate DESC
        LIMIT ?
      `, [limit]);
      
      return rows;
    } catch (error) {
      console.error('Error fetching recent inquiries:', error.message);
      throw new Error('Unable to retrieve recent inquiries');
    }
  }

  async getMonthlyStats(year) {
    try {
      const [rows] = await db.query(`
        SELECT 
          MONTH(updatedDate) as month,
          COUNT(*) as inquiries,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
        FROM inquiry
        WHERE YEAR(updatedDate) = ?
        GROUP BY MONTH(updatedDate)
        ORDER BY month
      `, [year]);
      
      // Fill in missing months with zero values
      const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        inquiries: 0,
        pending: 0,
        completed: 0
      }));
      
      rows.forEach(row => {
        monthlyStats[row.month - 1] = row;
      });
      
      return monthlyStats;
    } catch (error) {
      console.error('Error fetching monthly stats:', error.message);
      throw new Error('Unable to retrieve monthly statistics');
    }
  }

  async getPopularVehicles(limit) {
    try {
      const [rows] = await db.query(`
        SELECT v.id, CONCAT(v.make, ' ', v.model) as name, v.image,
               COUNT(i.id) as inquiryCount
        FROM vehicle v
        LEFT JOIN inquiry i ON v.id = i.vehicleID
        WHERE v.isActive = 1
        GROUP BY v.id, v.make, v.model, v.image
        ORDER BY inquiryCount DESC, v.make, v.model
        LIMIT ?
      `, [limit]);
      
      return rows;
    } catch (error) {
      console.error('Error fetching popular vehicles:', error.message);
      throw new Error('Unable to retrieve popular vehicles');
    }
  }

  async getPopularProperties(limit) {
    try {
      const [rows] = await db.query(`
        SELECT p.id, p.name, p.image,
               COUNT(i.id) as inquiryCount
        FROM property p
        LEFT JOIN inquiry i ON p.id = i.propertyID
        WHERE p.isActive = 1
        GROUP BY p.id, p.name, p.image
        ORDER BY inquiryCount DESC, p.name
        LIMIT ?
      `, [limit]);
      
      return rows;
    } catch (error) {
      console.error('Error fetching popular properties:', error.message);
      throw new Error('Unable to retrieve popular properties');
    }
  }
}

module.exports = new DashboardRepository();