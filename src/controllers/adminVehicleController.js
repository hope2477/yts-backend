const vehicleService = require('../services/vehicleService');
const imageUploadHelper = require('../utils/imageUploadHelper');

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
      // Process base64 images if provided
      let processedImages = { mainImage: '', allImages: [] };
      
      if (req.body.base64Images && Array.isArray(req.body.base64Images) && req.body.base64Images.length > 0) {
        const identifier = req.body.NumberPlate || req.body.make + req.body.model;
        processedImages = await imageUploadHelper.processImagesForCreation(
          req.body.base64Images, 
          'vehicle', 
          identifier
        );
      }
      
      const vehicleData = {
        ...req.body,
        image: processedImages.mainImage, // Set the main image
        images: processedImages.allImages, // Set all images for database storage
        createdBy: req.user.id // Get from authenticated user
      };

      // Remove base64Images from vehicleData to avoid sending to database
      delete vehicleData.base64Images;

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
      
      // Get existing vehicle data to access current images
      const existingVehicle = await vehicleService.getVehicleByIdForAdmin(id);
      if (!existingVehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }
      
      // Process base64 images if provided
      let processedImages = { mainImage: '', allImages: [] };
      
      if (req.body.base64Images && Array.isArray(req.body.base64Images) && req.body.base64Images.length > 0) {
        const identifier = req.body.NumberPlate || existingVehicle.NumberPlate || existingVehicle.make + existingVehicle.model;
        processedImages = await imageUploadHelper.processImagesForUpdate(
          req.body.base64Images,
          existingVehicle.images || [],
          'vehicle',
          identifier
        );
      } else {
        // Keep existing images if no new images provided
        processedImages.mainImage = existingVehicle.image || '';
        processedImages.allImages = existingVehicle.images || [];
      }
      
      const updateData = {
        ...req.body,
        image: processedImages.mainImage,
        images: processedImages.allImages,
        updatedBy: req.user.id // Get from authenticated user
      };

      // Remove base64Images from updateData to avoid sending to database
      delete updateData.base64Images;

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