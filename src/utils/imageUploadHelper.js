const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ImageUploadHelper {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../images/vehiclesAndProperties');
    this.ensureUploadDirectory();
  }

  ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log('Created upload directory:', this.uploadDir);
    }
  }

  /**
   * Save base64 image to file system
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} prefix - Prefix for filename (e.g., 'vehicle', 'property')
   * @param {string} originalName - Original filename (optional)
   * @returns {Promise<string>} - Returns the relative URL path
   */
  async saveBase64Image(base64Data, prefix = 'image', originalName = null) {
    try {
      // Remove data URL prefix if present (data:image/jpeg;base64,)
      const base64String = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Generate unique filename
      const timestamp = Date.now();
      const uniqueId = uuidv4().substring(0, 8);
      const extension = this.getImageExtension(base64Data);
      const filename = originalName 
        ? `${prefix}-${timestamp}-${originalName}`
        : `${prefix}-${timestamp}-${uniqueId}.${extension}`;
      
      const filePath = path.join(this.uploadDir, filename);
      
      // Convert base64 to buffer and save
      const imageBuffer = Buffer.from(base64String, 'base64');
      fs.writeFileSync(filePath, imageBuffer);
      
      // Return the URL path that matches your existing pattern
      return `/images/vehiclesAndProperties/${filename}`;
      
    } catch (error) {
      console.error('Error saving base64 image:', error);
      throw new Error('Failed to save image');
    }
  }

  /**
   * Save multiple base64 images
   * @param {Array} base64Images - Array of base64 image strings
   * @param {string} prefix - Prefix for filenames
   * @returns {Promise<Array>} - Returns array of URL paths
   */
  async saveMultipleBase64Images(base64Images, prefix) {
    if (!Array.isArray(base64Images) || base64Images.length === 0) {
      return [];
    }

    const savedImages = [];
    
    for (let i = 0; i < base64Images.length; i++) {
      const imageUrl = await this.saveBase64Image(base64Images[i], `${prefix}-${i + 1}`);
      savedImages.push(imageUrl);
    }
    
    return savedImages;
  }

  /**
   * Get image extension from base64 data
   * @param {string} base64Data - Base64 encoded image
   * @returns {string} - File extension
   */
  getImageExtension(base64Data) {
    if (base64Data.includes('data:image/jpeg') || base64Data.includes('data:image/jpg')) {
      return 'jpg';
    } else if (base64Data.includes('data:image/png')) {
      return 'png';
    } else if (base64Data.includes('data:image/gif')) {
      return 'gif';
    } else if (base64Data.includes('data:image/webp')) {
      return 'webp';
    }
    return 'jpg'; // Default fallback
  }

  /**
   * Delete image file from filesystem
   * @param {string} imageUrl - Image URL to delete
   * @returns {boolean} - Success status
   */
  deleteImage(imageUrl) {
    try {
      if (!imageUrl || !imageUrl.includes('/images/vehiclesAndProperties/')) {
        return false;
      }
      
      const filename = path.basename(imageUrl);
      const filePath = path.join(this.uploadDir, filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted image:', filename);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  /**
   * Delete multiple images
   * @param {Array} imageUrls - Array of image URLs to delete
   * @returns {number} - Number of successfully deleted images
   */
  deleteMultipleImages(imageUrls) {
    if (!Array.isArray(imageUrls)) return 0;
    
    let deletedCount = 0;
    imageUrls.forEach(url => {
      if (this.deleteImage(url)) {
        deletedCount++;
      }
    });
    
    return deletedCount;
  }

  /**
   * Process images for vehicle/property creation
   * @param {Array} base64Images - Array of base64 images from frontend
   * @param {string} type - 'vehicle' or 'property'
   * @param {string} identifier - Vehicle plate number or property name for filename
   * @returns {Promise<Object>} - Returns {mainImage, allImages}
   */
  async processImagesForCreation(base64Images, type, identifier = '') {
    if (!base64Images || !Array.isArray(base64Images) || base64Images.length === 0) {
      return { mainImage: '', allImages: [] };
    }

    const sanitizedIdentifier = identifier.replace(/[^a-zA-Z0-9]/g, '');
    const prefix = `${type}-${sanitizedIdentifier}`;
    
    const savedImages = await this.saveMultipleBase64Images(base64Images, prefix);
    
    return {
      mainImage: savedImages[0] || '',
      allImages: savedImages
    };
  }

  /**
   * Process images for vehicle/property updates
   * @param {Array} base64Images - New base64 images from frontend
   * @param {Array} existingImages - Current image URLs in database
   * @param {string} type - 'vehicle' or 'property'
   * @param {string} identifier - Vehicle plate number or property name
   * @returns {Promise<Object>} - Returns {mainImage, allImages, deletedImages}
   */
  async processImagesForUpdate(base64Images, existingImages, type, identifier = '') {
    const result = {
      mainImage: '',
      allImages: [],
      deletedImages: []
    };

    // If no new images provided, keep existing
    if (!base64Images || !Array.isArray(base64Images) || base64Images.length === 0) {
      result.mainImage = existingImages[0] || '';
      result.allImages = existingImages || [];
      return result;
    }

    // Delete existing images
    if (existingImages && existingImages.length > 0) {
      const deletedCount = this.deleteMultipleImages(existingImages);
      result.deletedImages = existingImages;
      console.log(`Deleted ${deletedCount} existing images`);
    }

    // Save new images
    const sanitizedIdentifier = identifier.replace(/[^a-zA-Z0-9]/g, '');
    const prefix = `${type}-${sanitizedIdentifier}`;
    
    const savedImages = await this.saveMultipleBase64Images(base64Images, prefix);
    
    result.mainImage = savedImages[0] || '';
    result.allImages = savedImages;
    
    return result;
  }
}

module.exports = new ImageUploadHelper();