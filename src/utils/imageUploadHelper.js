const fs = require('fs');
const path = require('path');
require('dotenv').config()

class ImageUploadHelper {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads/rentalImages');
    this.ensureUploadDirectory();

    // Read frontend base URL from .env
    this.frontendUrl = process.env.FRONTEND_URL || '';
  }

  ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log('Created upload directory:', this.uploadDir);
    }
  }

  /**
   * Save base64 image to file system with specific naming convention
   * @param {string} base64Data - Base64 encoded image data
   * @param {string} filename - Specific filename to use
   * @returns {Promise<string>} - Returns the filename only
   */
  async saveBase64Image(base64Data, filename) {
    try {
      // Remove data URL prefix if present (data:image/jpeg;base64,)
      const base64String = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Get extension from base64 data
      const extension = this.getImageExtension(base64Data);
      const fullFilename = `${filename}.${extension}`;
      
      const filePath = path.join(this.uploadDir, fullFilename);
      
      // Convert base64 to buffer and save
      const imageBuffer = Buffer.from(base64String, 'base64');
      fs.writeFileSync(filePath, imageBuffer);
      
      // Return only the filename (not the full path)
      return fullFilename;
      
    } catch (error) {
      console.error('Error saving base64 image:', error);
      throw new Error('Failed to save image');
    }
  }

  /**
   * Save multiple base64 images with proper naming convention
   * @param {Array} base64Images - Array of base64 image strings
   * @param {string} identifier - Vehicle number plate or property name
   * @param {string} type - 'vehicle' or 'property'
   * @returns {Promise<Array>} - Returns array of filenames only
   */
  async saveMultipleBase64Images(base64Images, identifier, type) {
    if (!Array.isArray(base64Images) || base64Images.length === 0) {
      return [];
    }

    // Clean identifier (remove spaces and special characters)
    const cleanIdentifier = identifier.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    
    const savedImages = [];
    
    for (let i = 0; i < base64Images.length; i++) {
      const filename = `${cleanIdentifier}-${i + 1}`;
      const savedFilename = await this.saveBase64Image(base64Images[i], filename);
      savedImages.push(savedFilename);
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
   * Delete image file from filesystem using filename
   * @param {string} filename - Image filename to delete
   * @returns {boolean} - Success status
   */
  deleteImage(filename) {
    try {
      if (!filename) {
        return false;
      }
      
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
   * @param {Array} filenames - Array of image filenames to delete
   * @returns {number} - Number of successfully deleted images
   */
  deleteMultipleImages(filenames) {
    if (!Array.isArray(filenames)) return 0;
    
    let deletedCount = 0;
    filenames.forEach(filename => {
      if (this.deleteImage(filename)) {
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
  async processImagesForCreation(base64Images, type, identifier) {
    if (!base64Images || !Array.isArray(base64Images) || base64Images.length === 0) {
      return { mainImage: '', allImages: [] };
    }

    const savedImages = await this.saveMultipleBase64Images(base64Images, identifier, type);
    
    return {
      mainImage: savedImages[0] || '',
      allImages: savedImages // All images including the first one
    };
  }

  /**
   * Process images for vehicle/property updates
   * This handles mixed arrays of existing URLs and new base64 images
   * @param {Array} imageData - Mixed array of existing filenames and new base64 images
   * @param {Array} existingImages - Current image filenames in database
   * @param {string} type - 'vehicle' or 'property'
   * @param {string} identifier - Vehicle plate number or property name
   * @returns {Promise<Object>} - Returns {mainImage, allImages, deletedImages}
   */
  async processImagesForUpdate(imageData, existingImages, type, identifier) {
    const result = {
      mainImage: '',
      allImages: [],
      deletedImages: []
    };

    if (!imageData || !Array.isArray(imageData) || imageData.length === 0) {
      result.mainImage = existingImages[0] || '';
      result.allImages = [...existingImages];
      return result;
    }

    const existingFilenames = [];
    const newBase64Images = [];

    imageData.forEach(item => {
      if (typeof item === 'string') {
        if (item.startsWith('data:image/')) {
          newBase64Images.push(item);
        } else {
          existingFilenames.push(item);
        }
      }
    });

    // Remove duplicates from existing filenames
    const uniqueExisting = [...new Set(existingFilenames)];

    // Find images to delete (existing DB images not in updated list)
    const imagesToDelete = existingImages.filter(img => !uniqueExisting.includes(img));
    if (imagesToDelete.length > 0) {
      const deletedCount = this.deleteMultipleImages(imagesToDelete);
      result.deletedImages = imagesToDelete;
      console.log(`Deleted ${deletedCount} images during update`);
    }

    // Find max numeric suffix for new images
    let maxSuffix = 0;
    existingImages.forEach(img => {
      const match = img.match(/-(\d+)\./);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxSuffix) maxSuffix = num;
      }
    });

    // Save new base64 images with incremental suffix
    const cleanIdentifier = identifier.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    const newSavedImages = [];
    for (let i = 0; i < newBase64Images.length; i++) {
      // Correct way
      const filename = `${cleanIdentifier}-${maxSuffix + i + 1}`; // no .jpg here
      const savedFilename = await this.saveBase64Image(newBase64Images[i], filename);
      newSavedImages.push(savedFilename);
    }

    // Combine unique existing and new images
    const allImages = [...uniqueExisting, ...newSavedImages];

    result.mainImage = allImages[0] || '';
    result.allImages = allImages;

    return result;
  }


  /**
   * Convert filename to full URL for frontend
   * @param {string} filename - Image filename
   * @returns {string} - Full URL
   */
  getImageUrl(filename) {
    if (!filename) return '';
    return `${this.frontendUrl}/uploads/rentalImages/${filename}`;
  }

  /**
   * Convert array of filenames to full URLs for frontend
   * @param {Array} filenames - Array of image filenames
   * @returns {Array} - Array of full URLs
   */
  getImageUrls(filenames) {
    if (!Array.isArray(filenames)) return [];
    return filenames.map(filename => `${this.frontendUrl}/uploads/rentalImages/${filename}`);
  }

  /**
   * Extract filename from URL
   * @param {string} url - Image URL
   * @returns {string} - Filename only
   */
  getFilenameFromUrl(url) {
    if (!url) return '';
    return path.basename(url);
  }

  /**
   * Extract filenames from URLs
   * @param {Array} urls - Array of image URLs
   * @returns {Array} - Array of filenames
   */
  getFilenamesFromUrls(urls) {
    if (!Array.isArray(urls)) return [];
    return urls.map(url => this.getFilenameFromUrl(url));
  }
}

module.exports = new ImageUploadHelper();