const vehicleRepository = require('../repositories/vehicleRepository');

class VehicleService {
    async getAllVehicles({ searchText, availabilityStart, availabilityEnd, vehicleType }) {
        return vehicleRepository.getAllVehicles({ searchText, availabilityStart, availabilityEnd, vehicleType });
      }
    
      async getVehicleById(id) {
        return vehicleRepository.getVehicleByID(id);
      }

      async getVehicleAvailabilityByID(id) {
        return vehicleRepository.getVehicleAvailabilityByID(id);
      }

      async updateVehicleStatus(vehicleId, userId, isActive) {
        return vehicleRepository.updateVehicleStatus(vehicleId, userId, isActive);
      }

      // Admin-specific methods
      async getAllVehiclesForAdmin({ page, limit, search, isFeatured }) {
        // Convert isFeatured string to boolean if needed
        let isFeaturedBool;
        if (isFeatured !== undefined) {
          isFeaturedBool = isFeatured === 'true' || isFeatured === true;
        }
        
        return vehicleRepository.getAllVehiclesForAdmin({
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
          search,
          isFeatured: isFeaturedBool
        });
      }

      async getVehicleByIdForAdmin(id) {
        return vehicleRepository.getVehicleByIdForAdmin(id);
      }

      async createVehicle(vehicleData) {
        // Validate required fields
        const requiredFields = ['make', 'model', 'fuelType', 'transmission', 
                              'numOfPassengers', 'vehicleClass', 'bodyStyle', 
                              'dailyCharge', 'createdBy'];
        const missingFields = requiredFields.filter(field => !vehicleData[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Ensure createdBy is from the authenticated user
        if (!vehicleData.createdBy || typeof vehicleData.createdBy !== 'number') {
          throw new Error('Invalid user identification');
        }

        // Validate image URLs if provided
        if (vehicleData.images && vehicleData.images.length > 0) {
          vehicleData.images.forEach((imageUrl, index) => {
            if (!imageUrl || typeof imageUrl !== 'string') {
              throw new Error(`Invalid image URL at index ${index}`);
            }
          });
        }
        return vehicleRepository.createVehicle(vehicleData);
    }

      async updateVehicle(id, updateData) {
        return vehicleRepository.updateVehicle(id, updateData);
      }

      async deleteVehicle(id, userId) {
        return vehicleRepository.deleteVehicle(id, userId);
      }

      async updateVehicleAvailability(id, availability, userId) {
        return vehicleRepository.updateVehicleAvailability(id, availability, userId);
      }

      async getVehicleFeatures(search) {
        return vehicleRepository.getVehicleFeatures(search);
      }

      async updateVehicleFeaturedStatus(id, isFeatured, userId) {
        try {
          return await vehicleRepository.updateVehicleFeaturedStatus(
            id, 
            isFeatured, 
            userId
          );
        } catch (error) {
          console.error('Error updating vehicle featured status:', error.message);
          throw new Error('Unable to update vehicle featured status');
        }
      }
  }
  
  module.exports = new VehicleService();
  