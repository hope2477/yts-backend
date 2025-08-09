const propertyService = require('../services/propertyService');

class PropertyController {
  // Get all properties
  async getAllProperties(req, res) {
    try {
      const { searchText, availabilityStart, availabilityEnd, numOfBedrooms } = req.body;      
      const properties = await propertyService.getAllProperties(searchText, availabilityStart, availabilityEnd, numOfBedrooms);
      res.json(properties);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  // Get a property by ID
  async getPropertyByID(req, res) {
    try {
      const propertyId = req.query.id; // Extract ID from query parameters
      if (!propertyId) {
        return res.status(400).send('Property ID is required');
      }
      const property = await propertyService.getPropertyByID(propertyId);
      if (property) {
        res.json(property);
      } else {
        res.status(404).send('Property not found');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  // Get property availability by ID
  async getPropertyAvailabilityByID(req, res) {
    try {
      const propertyId = req.query.id; // Extract ID from query parameters
      if (!propertyId) {
        return res.status(400).send('Property ID is required');
      }
      const availability = await propertyService.getPropertyAvailabilityByID(propertyId);
      if (availability) {
        res.json(availability);
      } else {
        res.status(404).send('Property availability not found');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async updatePropertyStatus(req, res) {
    try {
      const propertyId = req.params.id;
      const { userId, isActive } = req.body;

      if (!propertyId || userId === undefined || isActive === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Property ID, User ID, and isActive status are required'
        });
      }

      const result = await propertyService.updatePropertyStatus(propertyId, userId, isActive);
      
      if (result.success) {
        res.json({
          success: true,
          message: `Property ${isActive ? 'activated' : 'deactivated'} successfully`,
          data: result.property
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
        message: error.message || 'Failed to update property status'
      });
    }
  }
}

module.exports = new PropertyController();
