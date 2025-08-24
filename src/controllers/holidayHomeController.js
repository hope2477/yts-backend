const holidayHomeService = require('../services/holidayHomeService');

class HolidayHomeController {
  // Get holiday home availability by ID
  async getHolidayHomeAvailabilityByID(req, res) {
    try {
      const holidayHomeId = req.params.id; // Extract ID from path parameters
      if (!holidayHomeId) {
        return res.status(400).send('Holiday Home ID is required');
      }
      const availability = await holidayHomeService.getHolidayHomeAvailabilityByID(holidayHomeId);
      if (availability) {
        res.json(availability);
      } else {
        res.status(404).send('Holiday home availability not found');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = new HolidayHomeController();