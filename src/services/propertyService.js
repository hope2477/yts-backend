const propertyRepository = require('../repositories/propertyRepository');

class PropertyService {
    async getAllProperties(searchText, availabilityStart, availabilityEnd, numOfBedrooms) {
        return propertyRepository.getAllProperties(searchText, availabilityStart, availabilityEnd, numOfBedrooms);
      }
    
      async getPropertyByID(id) {
        return propertyRepository.getPropertyByID(id);
      }

      async getPropertyAvailabilityByID(id) {
        return propertyRepository.getPropertyAvailabilityByID(id);
      }

      async updatePropertyStatus(propertyId, userId, isActive) {
        return propertyRepository.updatePropertyStatus(propertyId, userId, isActive);
      }

      // Admin-specific methods
      async getAllPropertiesForAdmin({ page, limit, search, status }) {
        return propertyRepository.getAllPropertiesForAdmin({ page, limit, search, status });
      }

      async getPropertyByIdForAdmin(id) {
        return propertyRepository.getPropertyByIdForAdmin(id);
      }

      async createProperty(propertyData) {
        // Validate required fields
        const requiredFields = ['name', 'address', 'propertyType', 'propertyClass', 'numOfBedrooms', 'numOfBathrooms', 'rentalTypeID'];
        const missingFields = requiredFields.filter(field => !propertyData[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        return propertyRepository.createProperty(propertyData);
      }

      async updateProperty(id, updateData) {
        return propertyRepository.updateProperty(id, updateData);
      }

      async deleteProperty(id, userId) {
        return propertyRepository.deleteProperty(id, userId);
      }

      async updatePropertyAvailability(id, availability, userId) {
        return propertyRepository.updatePropertyAvailability(id, availability, userId);
      }

      async getPropertyFeatures() {
        return propertyRepository.getPropertyFeatures();
      }
  }
  
  module.exports = new PropertyService();
  