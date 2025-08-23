const propertyService = require('../services/propertyService');
const imageUploadHelper = require('../utils/imageUploadHelper');

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
      // Process base64 images if provided
      let processedImages = { mainImage: '', allImages: [] };
      
      if (req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0) {
        const identifier = req.body.name || 'property';
        processedImages = await imageUploadHelper.processImagesForCreation(
          req.body.images, 
          'property', 
          identifier
        );
      }
      
      const propertyData = {
        ...req.body,
        image: processedImages.mainImage, // Set the main image
        images: processedImages.allImages, // Set all images for database storage
        createdBy: req.user.id
      };

      // Remove base64Images from propertyData to avoid sending to database
      delete propertyData.base64Images;

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

      // Get existing property data
      const existingProperty = await propertyService.getPropertyByIdForAdmin(id);
      if (!existingProperty) {
        return res.status(404).json({ success: false, error: 'Property not found' });
      }

      // Process images (mixed existing + base64)
      let processedImages = { mainImage: '', allImages: [] };

      if (req.body.images && Array.isArray(req.body.images)) {
        const identifier = req.body.name || existingProperty.name || 'property';
        const existingFilenames = (existingProperty.images || []).map(img =>
          imageUploadHelper.getFilenameFromUrl(img)
        );

        processedImages = await imageUploadHelper.processImagesForUpdate(
          req.body.images,
          existingFilenames,
          'property',
          identifier
        );
      } else {
        // Keep existing images if no new images provided
        processedImages.mainImage = imageUploadHelper.getFilenameFromUrl(existingProperty.image || '');
        processedImages.allImages = (existingProperty.images || []).map(img =>
          imageUploadHelper.getFilenameFromUrl(img)
        );
      }

      const updateData = {
        ...req.body,
        image: processedImages.allImages[0] || existingProperty.image, // First image is main
        images: processedImages.allImages,
        updatedBy: req.user.id
      };

      // Validate arrays
      if (updateData.features && !Array.isArray(updateData.features)) {
        return res.status(400).json({ success: false, error: 'Features must be an array of IDs' });
      }
      if (updateData.availability && !Array.isArray(updateData.availability)) {
        return res.status(400).json({ success: false, error: 'Availability must be an array' });
      }

      const success = await propertyService.updateProperty(id, updateData);

      if (!success) {
        return res.status(404).json({ success: false, error: 'Property not found' });
      }

      res.json({ success: true, message: 'Property updated successfully' });
    } catch (error) {
      console.error('Update Property Error:', error);
      res.status(400).json({ success: false, error: error.message });
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