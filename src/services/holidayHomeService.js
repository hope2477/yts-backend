const holidayHomeRepository = require('../repositories/holidayHomeRepository');

class HolidayHomeService {
  async getHolidayHomeAvailabilityByID(id) {
    return holidayHomeRepository.getHolidayHomeAvailabilityByID(id);
  }

  async getHolidayHomeAvailabilityByID(id) {
    return holidayHomeRepository.getHolidayHomeAvailabilityByID(id);
  }

  async updateHolidayHomeAvailability(holidayHomeId, availability, userId) {
    return holidayHomeRepository.updateHolidayHomeAvailability(holidayHomeId, availability, userId);
  }
}

module.exports = new HolidayHomeService();