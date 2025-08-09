const db = require('../config/database');

class PropertyRepository {
    // Returns all the properties in the DB
    async getAllProperties(searchText, availabilityStart, availabilityEnd, numOfBedrooms) {
      try {
          // Base query
          let query = `
          SELECT p.id, p.name, p.address, p.propertyType, p.propertyClass, 
                 p.numOfBedrooms, p.numOfBathrooms, p.numOfVehicleParking, 
                 p.isActive, rt.name AS type, p.rentalTypeID, p.image,
                 (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT('startDate', pa.startDate, 'endDate', pa.endDate)
                  )
                  FROM propertyAvailability pa
                  WHERE pa.propertyId = p.id
                 ) AS availability
          FROM property p
          JOIN rentalType rt ON p.rentalTypeID = rt.id
          WHERE 1=1
          `;
  
          const queryParams = [];
  
          // Search text filter for address
          if (searchText) {
              query += ' AND p.address LIKE ?';
              queryParams.push(`%${searchText}%`);
          }
  
          // Availability date range filter (only used in the subquery)
          if (availabilityStart && availabilityEnd) {
              query += ` AND p.id NOT IN (
                  SELECT pa.propertyId 
                  FROM propertyAvailability pa
                  WHERE pa.startDate < ? AND pa.endDate > ?
              )`;
              queryParams.push(availabilityEnd, availabilityStart); // Add for range check
          }
  
          // Number of bedrooms filter
          if (numOfBedrooms) {
              query += ' AND p.numOfBedrooms = ?';
              queryParams.push(numOfBedrooms);
          }
          
          // Order by name and isActive
          query += ' ORDER BY p.name ASC, p.isActive DESC';

          // Execute the query
          const [properties] = await db.query(query, queryParams);
  
          // Null or empty check
          if (!properties || properties.length === 0) {
              return { data: [] };
          }
  
          // Transform the rows to convert isActive to a boolean
          const result = properties.map(property => ({
              ...property,
              isActive: property.isActive === 1, // Convert to boolean
          }));
  
          return { data: result };
  
      } catch (error) {
          console.error('Error fetching properties:', error.message);
          throw new Error('Unable to retrieve properties'); // Propagate the error
      }
  }

  // Returns property details by ID
  async getPropertyByID(id) {
    try {
      // Get the property details
      const [propertyDetails] = await db.query('SELECT * FROM property WHERE id = ?', [id]);
      const property = propertyDetails[0];

      // Null check
      if (!property) {
        return { data: null };
      }

      // Get the features for the selected property
      const [featureResult] = await db.query(
        `SELECT f.id AS featureID, f.name AS featureName 
         FROM propertyfeatures pf 
         JOIN feature f ON pf.featureId = f.id 
         WHERE pf.propertyID = ?`,
        [id]
      );

      // Get the images for the selected property
      const [imageResult] = await db.query(
        `SELECT image 
        FROM propertyImages 
        WHERE propertyID = ? 
        ORDER BY image`,
        [id]
      );

      // Transform the features to an array of feature objects
      const features = featureResult.map(feature => ({
        featureID: feature.featureID,
        featureName: feature.featureName,
      }));

      // Transform the images to an array of strings
      const images = imageResult.map(image => image.image);

      // Transform the property data to convert isActive and isFeatured to boolean
      const result = {
        ...property,
        isActive: property.isActive === 1,  // Explicitly check for 1
        isFeatured: property.isFeatured === 1,  // Explicitly check for 1
        features,
        images,
      };

      return { data: result };

    } catch (error) {
      console.error('Error fetching property details:', error.message);
      throw new Error('Unable to retrieve property details');
    }
  }

  // Returns property availability by ID
  async getPropertyAvailabilityByID(id) {
    try {
      const [result] = await db.query(
        'SELECT id, propertyID, startDate, endDate FROM propertyAvailability WHERE propertyID = ?',
        [id]
      );

      // Null or empty check
      if (!result || result.length === 0) {
        return { data: [] };
      }

      return { data: result };

    } catch (error) {
      console.error('Error fetching property availability:', error.message);
      throw new Error('Unable to retrieve property availability');
    }
  }

  async updatePropertyStatus(id, userId, isActive) {
    try {
      // First check if property exists
      const [property] = await db.query(
        'SELECT id, isActive FROM property WHERE id = ?', 
        [id]
      );
      
      if (!property || property.length === 0) {
        return { 
          success: false, 
          message: 'Property not found' 
        };
      }

      // Skip update if already in desired state
      if (property[0].isActive === isActive) {
        return { 
          success: true, 
          message: `Property already ${isActive ? 'active' : 'inactive'}`,
          property: property[0]
        };
      }

      // Update status
      await db.query(
        'UPDATE property SET isActive = ?, updatedBy = ?, updatedDate = NOW() WHERE id = ?',
        [isActive, userId, id]
      );
      
      // Get updated property
      const [updatedProperty] = await db.query('SELECT * FROM property WHERE id = ?', [id]);
      
      return { 
        success: true,
        property: updatedProperty[0]
      };
    } catch (error) {
      console.error('Error updating property status:', error.message);
      throw new Error('Unable to update property status');
    }
  }
}

module.exports = new PropertyRepository();