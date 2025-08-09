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
  }
  
  module.exports = new VehicleService();
  