const imageUploadHelper = require('../utils/imageUploadHelper');

class ImageUploadMiddleware {
  /**
   * Middleware to validate and process image uploads
   */
  validateImageUpload() {
    return (req, res, next) => {
      try {
        // Check if base64Images are provided
        if (req.body.base64Images) {
          // Validate that it's an array
          if (!Array.isArray(req.body.base64Images)) {
            return res.status(400).json({
              success: false,
              error: 'base64Images must be an array'
            });
          }

          // Validate each base64 image
          for (let i = 0; i < req.body.base64Images.length; i++) {
            const base64Data = req.body.base64Images[i];
            
            if (typeof base64Data !== 'string') {
              return res.status(400).json({
                success: false,
                error: `Image at index ${i} must be a base64 string`
              });
            }

            // Check if it's a valid base64 image
            if (!this.isValidBase64Image(base64Data)) {
              return res.status(400).json({
                success: false,
                error: `Invalid image format at index ${i}. Only JPEG, PNG, GIF, and WebP are supported.`
              });
            }

            // Check file size (limit to 5MB per image)
            const sizeInBytes = this.getBase64Size(base64Data);
            const maxSize = 5 * 1024 * 1024; // 5MB
            
            if (sizeInBytes > maxSize) {
              return res.status(400).json({
                success: false,
                error: `Image at index ${i} exceeds maximum size of 5MB`
              });
            }
          }

          // Limit number of images (max 10 per vehicle/property)
          if (req.body.base64Images.length > 10) {
            return res.status(400).json({
              success: false,
              error: 'Maximum 10 images allowed per item'
            });
          }
        }

        next();
      } catch (error) {
        console.error('Image validation error:', error);
        res.status(500).json({
          success: false,
          error: 'Image validation failed'
        });
      }
    };
  }

  /**
   * Check if base64 string is a valid image
   * @param {string} base64Data - Base64 encoded data
   * @returns {boolean} - Validation result
   */
  isValidBase64Image(base64Data) {
    // Check for valid image data URL format
    const imageRegex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    return imageRegex.test(base64Data);
  }

  /**
   * Calculate base64 string size in bytes
   * @param {string} base64Data - Base64 encoded data
   * @returns {number} - Size in bytes
   */
  getBase64Size(base64Data) {
    // Remove data URL prefix
    const base64String = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Calculate size: base64 encoding increases size by ~33%
    // So actual size = (base64Length * 3) / 4
    return Math.floor((base64String.length * 3) / 4);
  }
}

module.exports = new ImageUploadMiddleware();