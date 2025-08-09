const propertyService = require('../services/propertyService');

class AdminPropertyController {
  async getAllProperties(req, res) {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      const properties = await propertyService.getAllPropertiesForAdmin({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status
      });
      
      res.json({
        success: true,
        data: properties
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getPropertyById(req, res) {
    try {
      const { id } = req.params;
      const property = await propertyService.getPropertyByIdForAdmin(id);
      
      if (!property) {
        return res.status(404).json({
          success: false,
          error: 'Property not found'
        });
      }

      res.json({
        success: true,
        data: property
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createProperty(req, res) {
    try {
      const propertyData = {
        ...req.body,
        createdBy: req.user.id
      };

      const propertyId = await propertyService.createProperty(propertyData);
      
      res.status(201).json({
        success: true,
        data: { propertyId }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateProperty(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedBy: req.user.id
      };

      const success = await propertyService.updateProperty(id, updateData);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Property not found'
        });
      }

      res.json({
        success: true,
        message: 'Property updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteProperty(req, res) {
    try {
      const { id } = req.params;
      const success = await propertyService.deleteProperty(id, req.user.id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Property not found'
        });
      }

      res.json({
        success: true,
        message: 'Property deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updatePropertyAvailability(req, res) {
    try {
      const { id } = req.params;
      const { availability } = req.body;

      const success = await propertyService.updatePropertyAvailability(
        id, 
        availability, 
        req.user.id
      );
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Property not found'
        });
      }

      res.json({
        success: true,
        message: 'Property availability updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getPropertyFeatures(req, res) {
    try {
      const features = await propertyService.getPropertyFeatures();
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
}

module.exports = new AdminPropertyController();