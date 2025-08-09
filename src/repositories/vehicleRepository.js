const db = require('../config/database');

class VehicleRepository {
  // Returns all the vehicles in the DB
  async getAllVehicles({ searchText, availabilityStart, availabilityEnd, vehicleType }) {
    try {
        // Base query
        let query = `
        SELECT v.id, v.make, v.model, v.year, v.fuelType, v.transmission, v.numOfPassengers, v.vehicleClass, v.bodyStyle, v.isActive,
               rt.name AS type, v.rentalTypeID, v.image,
               (SELECT JSON_ARRAYAGG(
                  JSON_OBJECT('startDate', va.startDate, 'endDate', va.endDate)
               )
                FROM vehicleAvailability va
                WHERE va.vehicleId = v.id
               ) AS availability
        FROM vehicle v
        JOIN rentalType rt ON v.rentalTypeID = rt.id
        WHERE 1=1
        `;

        const queryParams = [];

        // Search text filters for both make and model
        if (searchText) {
            query += ' AND (CONCAT(v.make, " ", v.model) LIKE ?)';
            queryParams.push(`%${searchText}%`);
        }

        // Availability date range filter
        if (availabilityStart && availabilityEnd) {
            query += `
                AND NOT EXISTS (
                    SELECT 1 
                    FROM vehicleAvailability va 
                    WHERE va.vehicleId = v.id 
                    AND va.startDate < ? 
                    AND va.endDate > ?
                )
            `;
            queryParams.push(availabilityEnd, availabilityStart); // Check vehicle availability in the range
        }

        // Vehicle type filter
        if (vehicleType) {
            query += ' AND v.bodyStyle = ?';
            queryParams.push(vehicleType);
        }

        // Order by model and isActive
        query += ' ORDER BY v.isActive DESC, v.model ASC';

        // Execute the query
        const [vehicles] = await db.query(query, queryParams);

        // Null or empty check
        if (!vehicles || vehicles.length === 0) {
            return { data: [] };
        }

        // Transform the rows to convert isActive to a boolean
        const result = vehicles.map(vehicle => ({
            ...vehicle,
            isActive: Boolean(vehicle.isActive), // Convert to boolean
        }));

        return { data: result };

      } catch (error) {
          console.error('Error fetching vehicles:', error.message);
          throw new Error('Unable to retrieve vehicles'); // Propagate the error
      }
  }
  // Returns vehicle details by ID
  async getVehicleByID(id) {
    try {
      // Get the vehicle details
      const [vehicleDetails] = await db.query('SELECT * FROM vehicle WHERE id = ?', [id]);
      const vehicle = vehicleDetails[0];

      // Null check
      if (!vehicle) {
        return { data: null };
      }

      // Get the features for the selected vehicle
      const [featureResult] = await db.query(
        `SELECT f.id AS featureID, f.name AS featureName 
         FROM vehicleFeature vf 
         JOIN feature f ON vf.featureId = f.id 
         WHERE vf.vehicleId = ?`,
        [id]
      );

      // Get the images for the selected vehicle
      const [imageResult] = await db.query(
        `SELECT image 
        FROM vehicleImages 
        WHERE vehicleID = ?
        ORDER BY image`, // Order the images by the image column
        [id]
      );

      // Transform the features to an array of feature objects
      const features = featureResult.map(feature => ({
        featureID: feature.featureID,
        featureName: feature.featureName,
      }));

      const images = imageResult.map(image => image.image);

      // Transform the vehicle data to convert isActive and isFeatured to boolean
      const result = {
        ...vehicle,
        isActive: Boolean(vehicle.isActive),
        isFeatured: Boolean(vehicle.isFeatured),
        features,
        images, // Add the images array
      };

      return { data: result };

    } catch (error) {
      console.error('Error fetching vehicle details:', error.message);
      throw new Error('Unable to retrieve vehicle details');
    }
  }

  // Returns vehicle availability by ID
  async getVehicleAvailabilityByID(id) {
    try {
      const [result] = await db.query(
        'SELECT id, vehicleId, startDate, endDate FROM vehicleAvailability WHERE vehicleId = ?',
        [id]
      );

      // Null or empty check
      if (!result || result.length === 0) {
        return { data: [] };
      }

      return { data: result };

    } catch (error) {
      console.error('Error fetching vehicle availability:', error.message);
      throw new Error('Unable to retrieve vehicle availability');
    }
  }

  async updateVehicleStatus(id, userId, isActive) {
    try {
      // First check if vehicle exists
      const [vehicle] = await db.query(
        'SELECT id, isActive FROM vehicle WHERE id = ?', 
        [id]
      );
      
      if (!vehicle || vehicle.length === 0) {
        return { 
          success: false, 
          message: 'Vehicle not found' 
        };
      }

      // Skip update if already in desired state
      if (vehicle[0].isActive === isActive) {
        return { 
          success: true, 
          message: `Vehicle already ${isActive ? 'active' : 'inactive'}`,
          vehicle: vehicle[0]
        };
      }

      // Update status
      await db.query(
        'UPDATE vehicle SET isActive = ?, updatedBy = ?, updatedDate = NOW() WHERE id = ?',
        [isActive, userId, id]
      );
      
      // Get updated vehicle
      const [updatedVehicle] = await db.query('SELECT * FROM vehicle WHERE id = ?', [id]);
      
      return { 
        success: true,
        vehicle: updatedVehicle[0]
      };
    } catch (error) {
      console.error('Error updating vehicle status:', error.message);
      throw new Error('Unable to update vehicle status');
    }
  }
}

module.exports = new VehicleRepository();
