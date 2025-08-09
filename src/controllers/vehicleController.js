const vehicleService = require('../services/vehicleService');

class VehicleController {
  // Get all vehicle details
  async getAllVehicleDetails(req, res) {
    try {
      const { searchText, availabilityStart, availabilityEnd, vehicleType } = req.body;
      const vehicles = await vehicleService.getAllVehicles({ searchText, availabilityStart, availabilityEnd, vehicleType });
      res.json(vehicles);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  // Get vehicle details by ID
  async getVehicleDetailsByID(req, res) {
    try {
      const vehicleId = req.query.id; // Extract ID from query parameters
      if (!vehicleId) {
        return res.status(400).send('Vehicle ID is required');
      }
      const vehicle = await vehicleService.getVehicleById(vehicleId);
      if (vehicle) {
        res.json(vehicle);
      } else {
        res.status(404).send('Vehicle not found');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  // Get vehicle availability by ID
  async getVehicleAvailabilityByID(req, res) {
    try {
      const vehicleId = req.query.id; // Extract ID from query parameters
      if (!vehicleId) {
        return res.status(400).send('Vehicle ID is required');
      }
      const availability = await vehicleService.getVehicleAvailabilityByID(vehicleId);
      if (availability) {
        res.json(availability);
      } else {
        res.status(404).send('Vehicle availability not found');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updateVehicleStatus(req, res) {
    try {
      const vehicleId = req.params.id;
      const { userId, isActive } = req.body;

      if (!vehicleId || userId === undefined || isActive === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Vehicle ID, User ID, and isActive status are required'
        });
      }

      const result = await vehicleService.updateVehicleStatus(vehicleId, userId, isActive);
      
      if (result.success) {
        res.json({
          success: true,
          message: `Vehicle ${isActive ? 'activated' : 'deactivated'} successfully`,
          data: result.vehicle
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update vehicle status'
      });
    }
  }
}

module.exports = new VehicleController();
