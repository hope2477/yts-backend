const imageCleanupHelper = require('../utils/imageCleanupHelper');

class AdminSystemController {
  /**
   * Clean up orphaned images
   */
  async cleanupImages(req, res) {
    try {
      const result = await imageCleanupHelper.cleanupOrphanedImages();
      
      res.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} orphaned images`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(req, res) {
    try {
      const stats = await imageCleanupHelper.getStorageStats();
      
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

module.exports = new AdminSystemController();