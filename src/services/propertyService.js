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
      async getAllPropertiesForAdmin({ page, limit, search, status, isFeatured }) {
        // Validate pagination parameters
        page = Math.max(1, parseInt(page));
        limit = Math.max(1, Math.min(parseInt(limit), 100)); // Cap at 100 items per page

        // Validate status filter
        if (status && !['active', 'inactive'].includes(status)) {
            throw new Error('Invalid status filter. Must be "active" or "inactive"');
        }

        // Validate isFeatured filter
        if (isFeatured !== undefined && typeof isFeatured !== 'boolean') {
            throw new Error('isFeatured must be a boolean value');
        }

        return propertyRepository.getAllPropertiesForAdmin({
            page,
            limit,
            search,
            status,
            isFeatured
        });
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

      async getPropertyFeatures(search) {
        // Validate search parameter if provided
        if (search && typeof search !== 'string') {
            throw new Error('Search parameter must be a string');
        }
        
        return propertyRepository.getPropertyFeatures(search);
    }

    async updatePropertyFeaturedStatus(id, isFeatured, userId) {
      // Validate property ID
      if (!id || typeof id !== 'string') {
          throw new Error('Invalid property ID');
      }

      return propertyRepository.updatePropertyFeaturedStatus(
          id, 
          isFeatured, 
          userId
      );
  }
  }
  
  module.exports = new PropertyService();
  