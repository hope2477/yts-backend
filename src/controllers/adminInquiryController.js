const inquiryService = require('../services/inquiryService');

class AdminInquiryController {
  async getAllInquiries(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        rentalType, 
        startDate, 
        endDate 
      } = req.query;
      
      const inquiries = await inquiryService.getAllInquiriesForAdmin({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        rentalType,
        startDate,
        endDate
      });
      
      res.json({
        success: true,
        data: inquiries
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getInquiryById(req, res) {
    try {
      const { id } = req.params;
      const inquiry = await inquiryService.getInquiryByIdForAdmin(id);
      
      if (!inquiry) {
        return res.status(404).json({
          success: false,
          error: 'Inquiry not found'
        });
      }

      res.json({
        success: true,
        data: inquiry
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateInquiryStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Status is required'
        });
      }

      const success = await inquiryService.updateInquiryStatus(
        id, 
        status, 
        remarks, 
        req.user.id
      );
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Inquiry not found'
        });
      }

      res.json({
        success: true,
        message: 'Inquiry status updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteInquiry(req, res) {
    try {
      const { id } = req.params;
      const success = await inquiryService.deleteInquiry(id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Inquiry not found'
        });
      }

      res.json({
        success: true,
        message: 'Inquiry deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getInquiryStats(req, res) {
    try {
      const stats = await inquiryService.getInquiryStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AdminInquiryController();