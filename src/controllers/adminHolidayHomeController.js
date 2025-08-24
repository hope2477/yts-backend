const holidayHomeService = require('../services/holidayHomeService');

class AdminHolidayHomeController {
  // Get holiday home availability by ID (Admin)
  async getHolidayHomeAvailabilityByID(req, res) {
    try {
      const holidayHomeId = req.params.id;
      if (!holidayHomeId) {
        return res.status(400).json({
          success: false,
          message: 'Holiday Home ID is required'
        });
      }
      const availability = await holidayHomeService.getHolidayHomeAvailabilityByID(holidayHomeId);
      
      res.json({
        success: true,
        data: availability.data
      });
    } catch (error) {
      console.error('Error fetching holiday home availability:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch holiday home availability'
      });
    }
  }

  // Update holiday home availability - completely replace the array
  async updateHolidayHomeAvailability(req, res) {
    try {
      const holidayHomeId = req.params.id;
      const { availability } = req.body;

      if (!holidayHomeId) {
        return res.status(400).json({
          success: false,
          message: 'Holiday Home ID is required'
        });
      }

      // Validate that availability is an array
      if (!Array.isArray(availability)) {
        return res.status(400).json({
          success: false,
          message: 'Availability must be an array'
        });
      }

      // Validate each availability object in the array
      for (const [index, avail] of availability.entries()) {
        if (!avail.startDate) {
          return res.status(400).json({
            success: false,
            message: `startDate is required for availability item ${index + 1}`
          });
        }
        
        // Validate date format
        if (isNaN(Date.parse(avail.startDate)) || (avail.endDate && isNaN(Date.parse(avail.endDate)))) {
          return res.status(400).json({
            success: false,
            message: `Invalid date format in availability item ${index + 1}`
          });
        }
      }

      const result = await holidayHomeService.updateHolidayHomeAvailability(
        holidayHomeId, 
        availability, 
        req.user.id
      );

      if (result.success) {
        res.json({
          success: true,
          message: 'Holiday home availability updated successfully',
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Error updating holiday home availability:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update holiday home availability'
      });
    }
  }
}

module.exports = new AdminHolidayHomeController();