const dashboardRepository = require('../repositories/dashboardRepository');

class DashboardService {
  async getDashboardStats() {
    return dashboardRepository.getDashboardStats();
  }

  async getRecentInquiries(limit) {
    return dashboardRepository.getRecentInquiries(limit);
  }

  async getMonthlyStats(year) {
    return dashboardRepository.getMonthlyStats(year);
  }

  async getPopularVehicles(limit) {
    return dashboardRepository.getPopularVehicles(limit);
  }

  async getPopularProperties(limit) {
    return dashboardRepository.getPopularProperties(limit);
  }
}

module.exports = new DashboardService();