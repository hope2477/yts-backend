const fs = require('fs');
const path = require('path');
const db = require('../config/database');

class ImageCleanupHelper {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../images/vehiclesAndProperties');
  }

  /**
   * Clean up orphaned images that are no longer referenced in database
   * This should be run periodically as a maintenance task
   */
  async cleanupOrphanedImages() {
    try {
      console.log('Starting image cleanup process...');
      
      // Get all image URLs from database
      const [vehicleImages] = await db.query(`
        SELECT DISTINCT image as url FROM vehicle WHERE image IS NOT NULL AND image != ''
        UNION
        SELECT DISTINCT image as url FROM vehicleImages WHERE image IS NOT NULL AND image != ''
      `);
      
      const [propertyImages] = await db.query(`
        SELECT DISTINCT image as url FROM property WHERE image IS NOT NULL AND image != ''
        UNION
        SELECT DISTINCT image as url FROM propertyImages WHERE image IS NOT NULL AND image != ''
      `);
      
      // Combine all database image URLs
      const dbImageUrls = [
        ...vehicleImages.map(row => row.url),
        ...propertyImages.map(row => row.url)
      ];
      
      // Extract filenames from URLs
      const dbFilenames = dbImageUrls
        .filter(url => url.includes('/images/vehiclesAndProperties/'))
        .map(url => path.basename(url));
      
      // Get all files in upload directory
      const filesInDirectory = fs.readdirSync(this.uploadDir);
      
      // Find orphaned files
      const orphanedFiles = filesInDirectory.filter(filename => 
        !dbFilenames.includes(filename) && 
        this.isImageFile(filename)
      );
      
      // Delete orphaned files
      let deletedCount = 0;
      orphanedFiles.forEach(filename => {
        try {
          const filePath = path.join(this.uploadDir, filename);
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(`Deleted orphaned image: ${filename}`);
        } catch (error) {
          console.error(`Failed to delete ${filename}:`, error.message);
        }
      });
      
      console.log(`Cleanup completed. Deleted ${deletedCount} orphaned images.`);
      return { deletedCount, orphanedFiles };
      
    } catch (error) {
      console.error('Error during image cleanup:', error);
      throw new Error('Image cleanup failed');
    }
  }

  /**
   * Check if file is an image based on extension
   * @param {string} filename - Filename to check
   * @returns {boolean} - True if it's an image file
   */
  isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
  }

  /**
   * Get storage statistics
   * @returns {Promise<Object>} - Storage usage information
   */
  async getStorageStats() {
    try {
      const files = fs.readdirSync(this.uploadDir);
      const imageFiles = files.filter(file => this.isImageFile(file));
      
      let totalSize = 0;
      imageFiles.forEach(file => {
        const filePath = path.join(this.uploadDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });
      
      return {
        totalFiles: imageFiles.length,
        totalSizeBytes: totalSize,
        totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
        directory: this.uploadDir
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      throw new Error('Failed to get storage statistics');
    }
  }
}

module.exports = new ImageCleanupHelper();