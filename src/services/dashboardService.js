const dashboardRepository = require('../repositories/dashboardRepository');

class DashboardService {
  async getDashboardStats() {
    return dashboardRepository.getDashboardStats();
  }

  async getDashboardOverview() {
    return dashboardRepository.getDashboardOverview();
  }

  async getRecentInquiries(limit, status) {
    return dashboardRepository.getRecentInquiries(limit, status);
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
