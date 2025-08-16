const propertyService = require('../services/propertyService');

class AdminPropertyController {
  async getAllProperties(req, res) {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            status, 
            isFeatured 
        } = req.query;

        // Convert string 'true'/'false' to boolean
        const featuredFilter = isFeatured ? 
            (isFeatured === 'true') : 
            undefined;

        const properties = await propertyService.getAllPropertiesForAdmin({
            page: parseInt(page),
            limit: parseInt(limit),
            search,
            status, // 'active' or 'inactive'
            isFeatured: featuredFilter
        });
        
        res.json({
            success: true,
            data: properties.data,
            pagination: properties.pagination
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

      // Validate features array if provided
      if (propertyData.features && !Array.isArray(propertyData.features)) {
        return res.status(400).json({
          success: false,
          error: 'Features must be an array of feature IDs'
        });
      }

      // Validate images array if provided
      if (propertyData.images && !Array.isArray(propertyData.images)) {
        return res.status(400).json({
          success: false,
          error: 'Images must be an array of image URLs'
        });
      }

      // Validate availability array if provided
      if (propertyData.availability && !Array.isArray(propertyData.availability)) {
        return res.status(400).json({
          success: false,
          error: 'Availability must be an array of date ranges'
        });
      }

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

      // Validate features array if provided
      if (updateData.features && !Array.isArray(updateData.features)) {
        return res.status(400).json({
          success: false,
          error: 'Features must be an array of feature IDs'
        });
      }

      // Validate images array if provided
      if (updateData.images && !Array.isArray(updateData.images)) {
        return res.status(400).json({
          success: false,
          error: 'Images must be an array of image URLs'
        });
      }

      // Validate availability array if provided
      if (updateData.availability && !Array.isArray(updateData.availability)) {
        return res.status(400).json({
          success: false,
          error: 'Availability must be an array of date ranges'
        });
      }

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
        const { search } = req.query;
        const features = await propertyService.getPropertyFeatures(search);
        
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

  async updatePropertyFeaturedStatus(req, res) {
    try {
        const { id } = req.params;
        const { isFeatured } = req.body;
        const userId = req.user.id; // Get user ID from token

        // Validate input
        if (typeof isFeatured !== 'boolean') {
            return res.status(400).json({
                success: false,
                error: 'isFeatured must be a boolean value'
            });
        }

        const success = await propertyService.updatePropertyFeaturedStatus(
            id, 
            isFeatured, 
            userId
        );

        if (!success) {
            return res.status(404).json({
                success: false,
                error: 'Property not found'
            });
        }

        res.json({
            success: true,
            message: 'Property featured status updated successfully'
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