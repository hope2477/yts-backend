const vehicleService = require('../services/vehicleService');

class AdminVehicleController {
  async getAllVehicles(req, res) {
    try {
      const { page = 1, limit = 10, search, isFeatured } = req.query;
      
      const result = await vehicleService.getAllVehiclesForAdmin({
        page,
        limit,
        search,
        isFeatured
      });
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getVehicleById(req, res) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleByIdForAdmin(id);
      
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createVehicle(req, res) {
    try {
      // Extract main image from the first image in the array (if provided)
      const mainImage = req.body.images && req.body.images.length > 0 
        ? req.body.images[0] 
        : '';
      
      const vehicleData = {
        ...req.body,
        image: mainImage, // Set the main image
        createdBy: req.user.id // Get from authenticated user
      };

      // Validate features array if provided
      if (vehicleData.features && !Array.isArray(vehicleData.features)) {
        return res.status(400).json({
          success: false,
          error: 'Features must be an array of feature IDs'
        });
      }

      // Validate images array if provided
      if (vehicleData.images && !Array.isArray(vehicleData.images)) {
        return res.status(400).json({
          success: false,
          error: 'Images must be an array of image URLs'
        });
      }

      // Validate availability array if provided
      if (vehicleData.availability && !Array.isArray(vehicleData.availability)) {
        return res.status(400).json({
          success: false,
          error: 'Availability must be an array of date ranges'
        });
      }

      const vehicleId = await vehicleService.createVehicle(vehicleData);
      
      res.status(201).json({
        success: true,
        data: { vehicleId }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateVehicle(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedBy: req.user.id // Get from authenticated user
      };

      // Set main image from first image in array if images are provided
      if (updateData.images && updateData.images.length > 0) {
        updateData.image = updateData.images[0];
      }

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

      const success = await vehicleService.updateVehicle(id, updateData);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        message: 'Vehicle updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteVehicle(req, res) {
    try {
      const { id } = req.params;
      const success = await vehicleService.deleteVehicle(id, req.user.id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateVehicleAvailability(req, res) {
    try {
      const { id } = req.params;
      const { availability } = req.body;

      const success = await vehicleService.updateVehicleAvailability(
        id, 
        availability, 
        req.user.id
      );
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        message: 'Vehicle availability updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getVehicleFeatures(req, res) {
    try {
      const { search } = req.query;

      const features = await vehicleService.getVehicleFeatures(search);

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

  async updateFeaturedStatus(req, res) {
    try {
      const { id } = req.params;
      const { isFeatured } = req.body;
      
      if (typeof isFeatured !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'isFeatured must be a boolean value'
        });
      }

      const updated = await vehicleService.updateVehicleFeaturedStatus(
        id, 
        isFeatured, 
        req.user.id
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        message: 'Featured status updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AdminVehicleController();