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
      async getAllVehiclesForAdmin({ page, limit, search, status }) {
        return vehicleRepository.getAllVehiclesForAdmin({ page, limit, search, status });
      }

      async getVehicleByIdForAdmin(id) {
        return vehicleRepository.getVehicleByIdForAdmin(id);
      }

      async createVehicle(vehicleData) {
        // Validate required fields
        const requiredFields = ['make', 'model', 'fuelType', 'transmission', 'numOfPassengers', 'vehicleClass', 'bodyStyle', 'dailyCharge'];
        const missingFields = requiredFields.filter(field => !vehicleData[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
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

      async getVehicleFeatures() {
        return vehicleRepository.getVehicleFeatures();
      }
  }
  
  module.exports = new VehicleService();
  