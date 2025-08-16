const featureService = require('../services/featureService');

class AdminFeatureController {
  async getAllFeatures(req, res) {
    try {
      const { rentalType, search } = req.query;
      const features = await featureService.getAllFeatures(rentalType, search);
      
      res.json({
        success: true,
        data: features
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getFeatureById(req, res) {
    try {
      const { id } = req.params;
      const feature = await featureService.getFeatureById(id);
      
      if (!feature) {
        return res.status(404).json({
          success: false,
          error: 'Feature not found'
        });
      }

      res.json({
        success: true,
        data: feature
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createFeature(req, res) {
    try {
      const featureData = {
        ...req.body,
        createdBy: req.user.id
      };

      const featureId = await featureService.createFeature(featureData);
      
      res.status(201).json({
        success: true,
        data: { featureId }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateFeature(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedBy: req.user.id
      };

      const success = await featureService.updateFeature(id, updateData);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Feature not found'
        });
      }

      res.json({
        success: true,
        message: 'Feature updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteFeature(req, res) {
    try {
      const { id } = req.params;
      const success = await featureService.deleteFeature(id, req.user.id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Feature not found'
        });
      }

      res.json({
        success: true,
        message: 'Feature deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AdminFeatureController();