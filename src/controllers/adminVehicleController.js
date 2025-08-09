const vehicleService = require('../services/vehicleService');

class AdminVehicleController {
  async getAllVehicles(req, res) {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      const vehicles = await vehicleService.getAllVehiclesForAdmin({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        status
      });
      
      res.json({
        success: true,
        data: vehicles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getVehicleById(req, res) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleByIdForAdmin(id);
      
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createVehicle(req, res) {
    try {
      const vehicleData = {
        ...req.body,
        createdBy: req.user.id
      };

      const vehicleId = await vehicleService.createVehicle(vehicleData);
      
      res.status(201).json({
        success: true,
        data: { vehicleId }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateVehicle(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedBy: req.user.id
      };

      const success = await vehicleService.updateVehicle(id, updateData);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        message: 'Vehicle updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteVehicle(req, res) {
    try {
      const { id } = req.params;
      const success = await vehicleService.deleteVehicle(id, req.user.id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        message: 'Vehicle deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateVehicleAvailability(req, res) {
    try {
      const { id } = req.params;
      const { availability } = req.body;

      const success = await vehicleService.updateVehicleAvailability(
        id, 
        availability, 
        req.user.id
      );
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      res.json({
        success: true,
        message: 'Vehicle availability updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getVehicleFeatures(req, res) {
    try {
      const features = await vehicleService.getVehicleFeatures();
      res.json({
        success: true,
        data: features
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AdminVehicleController();