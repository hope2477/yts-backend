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
  }
  
  module.exports = new PropertyService();
  