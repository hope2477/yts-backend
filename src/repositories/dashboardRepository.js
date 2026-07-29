const db = require('../config/database');
const imageUploadHelper = require('../utils/imageUploadHelper');

/** Normalize inquiry status comparisons (Pending / PENDING / pending). */
const STATUS_PENDING = `LOWER(TRIM(status)) = 'pending'`;
const STATUS_CLOSED = `LOWER(TRIM(status)) IN ('approved', 'completed', 'rejected')`;

const HOLIDAY_HOME_ID = 1;

function toCount(rows) {
  return Number(rows?.[0]?.count) || 0;
}

function mapInquiryRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    contactNumber: row.contactNumber,
    message: row.message,
    status: row.status,
    createdDate: row.createdDate,
    updatedDate: row.updatedDate,
    rentalType: row.rentalType,
    rentalName: row.rentalName,
  };
}

class DashboardRepository {
  async getDashboardStats() {
    const overview = await this.getDashboardOverview();
    return {
      totalVehicles: overview.kpis.activeVehicles,
      totalProperties: overview.kpis.activeProperties,
      totalInquiries: overview.kpis.totalInquiries,
      pendingInquiries: overview.kpis.pendingInquiries,
      monthlyInquiries: overview.kpis.inquiriesThisMonth,
    };
  }

  async getDashboardOverview() {
    try {
      const [
        [activeVehicles],
        [activeProperties],
        [featuredVehicles],
        [featuredProperties],
        [totalInquiries],
        [pendingInquiries],
        [inquiriesThisMonth],
        [completedThisMonth],
        [updatedLast24h],
        [holidayUpcomingBlocks],
        [vehiclesUnavailableToday],
        [propertiesUnavailableToday],
        byRentalTypeRows,
        byStatusRows,
        recentPendingRows,
      ] = await Promise.all([
        db.query('SELECT COUNT(*) AS count FROM vehicle WHERE isActive = 1'),
        db.query('SELECT COUNT(*) AS count FROM property WHERE isActive = 1'),
        db.query(
          'SELECT COUNT(*) AS count FROM vehicle WHERE isActive = 1 AND isFeatured = 1'
        ),
        db.query(
          'SELECT COUNT(*) AS count FROM property WHERE isActive = 1 AND isFeatured = 1'
        ),
        db.query('SELECT COUNT(*) AS count FROM inquiry'),
        db.query(`SELECT COUNT(*) AS count FROM inquiry WHERE ${STATUS_PENDING}`),
        db.query(`
          SELECT COUNT(*) AS count FROM inquiry
          WHERE createdDate IS NOT NULL
            AND MONTH(createdDate) = MONTH(CURRENT_DATE())
            AND YEAR(createdDate) = YEAR(CURRENT_DATE())
        `),
        db.query(`
          SELECT COUNT(*) AS count FROM inquiry
          WHERE ${STATUS_CLOSED}
            AND updatedDate IS NOT NULL
            AND MONTH(updatedDate) = MONTH(CURRENT_DATE())
            AND YEAR(updatedDate) = YEAR(CURRENT_DATE())
        `),
        db.query(`
          SELECT COUNT(*) AS count FROM inquiry
          WHERE updatedDate >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        `),
        db.query(
          `
          SELECT COUNT(*) AS count FROM holidayHomeAvailability
          WHERE holidayHomeId = ?
            AND endDate >= CURDATE()
        `,
          [HOLIDAY_HOME_ID]
        ),
        db.query(`
          SELECT COUNT(DISTINCT v.id) AS count
          FROM vehicle v
          INNER JOIN vehicleAvailability va ON va.vehicleId = v.id
          WHERE v.isActive = 1
            AND va.startDate <= CURDATE()
            AND va.endDate >= CURDATE()
        `),
        db.query(`
          SELECT COUNT(DISTINCT p.id) AS count
          FROM property p
          INNER JOIN propertyAvailability pa ON pa.propertyID = p.id
          WHERE p.isActive = 1
            AND pa.startDate <= CURDATE()
            AND pa.endDate >= CURDATE()
        `),
        db.query(`
          SELECT i.rentalTypeID AS rentalTypeId, rt.name AS name, COUNT(*) AS count
          FROM inquiry i
          JOIN rentalType rt ON rt.id = i.rentalTypeID
          GROUP BY i.rentalTypeID, rt.name
          ORDER BY count DESC
        `),
        db.query(`
          SELECT LOWER(TRIM(status)) AS status, COUNT(*) AS count
          FROM inquiry
          GROUP BY LOWER(TRIM(status))
          ORDER BY count DESC
        `),
        db.query(`
          SELECT i.id, i.name, i.email, i.contactNumber, i.message, i.status,
                 i.createdDate, i.updatedDate, rt.name AS rentalType,
                 CASE
                   WHEN i.vehicleID IS NOT NULL THEN CONCAT(TRIM(v.make), ' ', TRIM(v.model))
                   WHEN i.propertyID IS NOT NULL THEN p.name
                   WHEN i.holidayHomeID IS NOT NULL THEN 'Newlands Bungalow'
                   ELSE 'Unknown'
                 END AS rentalName
          FROM inquiry i
          JOIN rentalType rt ON i.rentalTypeID = rt.id
          LEFT JOIN vehicle v ON i.vehicleID = v.id
          LEFT JOIN property p ON i.propertyID = p.id
          WHERE ${STATUS_PENDING.replace(/status/g, 'i.status')}
          ORDER BY COALESCE(i.createdDate, i.updatedDate) DESC
          LIMIT 50
        `),
      ]);

      let soldOutProperties = 0;
      try {
        const [[soldOutRow]] = await db.query(
          'SELECT COUNT(*) AS count FROM property WHERE isActive = 1 AND isSoldOut = 1'
        );
        soldOutProperties = toCount([soldOutRow]);
      } catch (soldOutErr) {
        console.warn('Dashboard sold-out property count skipped:', soldOutErr.message);
      }

      let blogsPublished = 0;
      let blogsDraft = 0;
      try {
        const [[published]] = await db.query(`
          SELECT COUNT(*) AS count FROM blog
          WHERE isActive = 1 AND isPublished = 1
        `);
        const [[draft]] = await db.query(`
          SELECT COUNT(*) AS count FROM blog
          WHERE isActive = 1 AND (isPublished = 0 OR isPublished IS NULL)
        `);
        blogsPublished = toCount([published]);
        blogsDraft = toCount([draft]);
      } catch (blogErr) {
        console.warn('Dashboard blog stats skipped:', blogErr.message);
      }

      let holidayBlockedNightsApprox = 0;
      try {
        const [nightRows] = await db.query(
          `
          SELECT COALESCE(SUM(DATEDIFF(endDate, startDate) + 1), 0) AS nights
          FROM holidayHomeAvailability
          WHERE holidayHomeId = ?
            AND endDate >= CURDATE()
        `,
          [HOLIDAY_HOME_ID]
        );
        holidayBlockedNightsApprox = Number(nightRows?.[0]?.nights) || 0;
      } catch {
        holidayBlockedNightsApprox = 0;
      }

      const pendingCount = toCount(pendingInquiries);

      return {
        attention: {
          pendingCount,
          recentPending: (recentPendingRows[0] || []).map(mapInquiryRow),
          updatedLast24h: toCount(updatedLast24h),
        },
        kpis: {
          totalInquiries: toCount(totalInquiries),
          inquiriesThisMonth: toCount(inquiriesThisMonth),
          pendingInquiries: pendingCount,
          completedThisMonth: toCount(completedThisMonth),
          activeVehicles: toCount(activeVehicles),
          activeProperties: toCount(activeProperties),
          soldOutProperties,
          featuredVehicles: toCount(featuredVehicles),
          featuredProperties: toCount(featuredProperties),
          holidayUpcomingBlocks: toCount(holidayUpcomingBlocks),
          holidayBlockedNightsApprox,
          blogsPublished,
          blogsDraft,
        },
        inquiryMix: {
          byRentalType: (byRentalTypeRows[0] || []).map((row) => ({
            rentalTypeId: row.rentalTypeId,
            name: row.name,
            count: Number(row.count) || 0,
          })),
          byStatus: (byStatusRows[0] || []).map((row) => ({
            status: row.status || 'unknown',
            count: Number(row.count) || 0,
          })),
        },
        inventoryHealth: {
          vehiclesUnavailableToday: toCount(vehiclesUnavailableToday),
          propertiesUnavailableToday: toCount(propertiesUnavailableToday),
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard overview:', error.message);
      throw new Error('Unable to retrieve dashboard overview');
    }
  }

  async getRecentInquiries(limit, statusFilter) {
    try {
      const params = [];
      let where = 'WHERE 1=1';
      if (statusFilter) {
        where += ' AND LOWER(TRIM(i.status)) = ?';
        params.push(String(statusFilter).toLowerCase().trim());
      }
      params.push(Number(limit) || 5);

      const [rows] = await db.query(
        `
        SELECT i.id, i.name, i.email, i.contactNumber, i.message, i.status,
               i.createdDate, i.updatedDate, rt.name AS rentalType,
               CASE
                 WHEN i.vehicleID IS NOT NULL THEN CONCAT(TRIM(v.make), ' ', TRIM(v.model))
                 WHEN i.propertyID IS NOT NULL THEN p.name
                 WHEN i.holidayHomeID IS NOT NULL THEN 'Newlands Bungalow'
                 ELSE 'Unknown'
               END AS rentalName
        FROM inquiry i
        JOIN rentalType rt ON i.rentalTypeID = rt.id
        LEFT JOIN vehicle v ON i.vehicleID = v.id
        LEFT JOIN property p ON i.propertyID = p.id
        ${where}
        ORDER BY COALESCE(i.createdDate, i.updatedDate) DESC
        LIMIT ?
      `,
        params
      );

      return rows.map(mapInquiryRow);
    } catch (error) {
      console.error('Error fetching recent inquiries:', error.message);
      throw new Error('Unable to retrieve recent inquiries');
    }
  }

  async getMonthlyStats(year) {
    try {
      const [rows] = await db.query(
        `
        SELECT
          MONTH(createdDate) AS month,
          COUNT(*) AS inquiries,
          SUM(CASE WHEN ${STATUS_PENDING} THEN 1 ELSE 0 END) AS pending,
          SUM(CASE WHEN ${STATUS_CLOSED} THEN 1 ELSE 0 END) AS completed
        FROM inquiry
        WHERE createdDate IS NOT NULL
          AND YEAR(createdDate) = ?
        GROUP BY MONTH(createdDate)
        ORDER BY month
      `,
        [year]
      );

      const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        inquiries: 0,
        pending: 0,
        completed: 0,
      }));

      rows.forEach((row) => {
        monthlyStats[row.month - 1] = {
          month: Number(row.month),
          inquiries: Number(row.inquiries) || 0,
          pending: Number(row.pending) || 0,
          completed: Number(row.completed) || 0,
        };
      });

      return monthlyStats;
    } catch (error) {
      console.error('Error fetching monthly stats:', error.message);
      throw new Error('Unable to retrieve monthly statistics');
    }
  }

  async getPopularVehicles(limit) {
    try {
      const [rows] = await db.query(
        `
        SELECT v.id, CONCAT(TRIM(v.make), ' ', TRIM(v.model)) AS name, v.image,
               COUNT(i.id) AS inquiryCount
        FROM vehicle v
        LEFT JOIN inquiry i ON v.id = i.vehicleID
        WHERE v.isActive = 1
        GROUP BY v.id, v.make, v.model, v.image
        ORDER BY inquiryCount DESC, v.make, v.model
        LIMIT ?
      `,
        [limit]
      );

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        image: imageUploadHelper.getImageUrl(row.image),
        inquiryCount: Number(row.inquiryCount) || 0,
      }));
    } catch (error) {
      console.error('Error fetching popular vehicles:', error.message);
      throw new Error('Unable to retrieve popular vehicles');
    }
  }

  async getPopularProperties(limit) {
    try {
      const [rows] = await db.query(
        `
        SELECT p.id, p.name, p.image,
               COUNT(i.id) AS inquiryCount
        FROM property p
        LEFT JOIN inquiry i ON p.id = i.propertyID
        WHERE p.isActive = 1
        GROUP BY p.id, p.name, p.image
        ORDER BY inquiryCount DESC, p.name
        LIMIT ?
      `,
        [limit]
      );

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        image: imageUploadHelper.getImageUrl(row.image),
        inquiryCount: Number(row.inquiryCount) || 0,
      }));
    } catch (error) {
      console.error('Error fetching popular properties:', error.message);
      throw new Error('Unable to retrieve popular properties');
    }
  }
}

module.exports = new DashboardRepository();
