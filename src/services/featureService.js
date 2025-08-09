const featureRepository = require('../repositories/featureRepository');

class FeatureService {
  async getAllFeatures(rentalType) {
    return featureRepository.getAllFeatures(rentalType);
  }

  async getFeatureById(id) {
    return featureRepository.getFeatureById(id);
  }

  async createFeature(featureData) {
    // Validate required fields
    const requiredFields = ['name', 'rentalId'];
    const missingFields = requiredFields.filter(field => !featureData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return featureRepository.createFeature(featureData);
  }

  async updateFeature(id, updateData) {
    return featureRepository.updateFeature(id, updateData);
  }

  async deleteFeature(id, userId) {
    return featureRepository.deleteFeature(id, userId);
  }
}

module.exports = new FeatureService();