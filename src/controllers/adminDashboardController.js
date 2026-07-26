const dashboardService = require('../services/dashboardService');

class AdminDashboardController {
  async getDashboardStats(req, res) {
    try {
      const stats = await dashboardService.getDashboardStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getDashboardOverview(req, res) {
    try {
      const overview = await dashboardService.getDashboardOverview();
      res.json({
        success: true,
        data: overview,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getRecentInquiries(req, res) {
    try {
      const { limit = 5, status } = req.query;
      const inquiries = await dashboardService.getRecentInquiries(
        parseInt(limit, 10),
        status || undefined
      );
      res.json({
        success: true,
        data: inquiries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getMonthlyStats(req, res) {
    try {
      const { year = new Date().getFullYear() } = req.query;
      const stats = await dashboardService.getMonthlyStats(parseInt(year, 10));
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getPopularVehicles(req, res) {
    try {
      const { limit = 5 } = req.query;
      const vehicles = await dashboardService.getPopularVehicles(parseInt(limit, 10));
      res.json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getPopularProperties(req, res) {
    try {
      const { limit = 5 } = req.query;
      const properties = await dashboardService.getPopularProperties(parseInt(limit, 10));
      res.json({
        success: true,
        data: properties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new AdminDashboardController();
