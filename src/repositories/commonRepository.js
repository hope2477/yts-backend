const db = require('../config/database');

class CommonRepository {
  async getFeaturedListings() {
    try {
        // Query to get featured and active properties, joining with the rental type
        const [properties] = await db.query(
            `SELECT p.id, p.name, p.address, p.propertyType, p.propertyClass, p.numOfBedrooms, p.numOfBathrooms, p.numOfVehicleParking, 
                    rt.name AS type, p.isActive, p.isFeatured, p.image
             FROM property p
             JOIN rentalType rt ON p.rentalTypeID = rt.id
             WHERE p.isActive = 1 AND p.isFeatured = 1
             ORDER BY p.name ASC;`
        );

        // Query to get featured and active vehicles
        const [vehicles] = await db.query(
            `SELECT v.id, CONCAT(v.make, ' ', v.model, ' (', v.year, ')') AS name, v.model, v.year, v.fuelType, v.transmission, v.numOfPassengers, v.vehicleClass AS label, 
                    v.bodyStyle, v.isActive, v.isFeatured, rt.name AS type, v.image
             FROM vehicle v
             JOIN rentalType rt ON v.rentalTypeID = rt.id
             WHERE v.isActive = 1 AND v.isFeatured = 1
             ORDER BY v.model ASC;`
        );

        // Check if both properties and vehicles are empty
        if ((!properties || properties.length === 0) && (!vehicles || vehicles.length === 0)) {
            return { data: [] };
        }

        // Convert `isActive` and `isFeatured` to boolean for properties
        const featuredProperties = properties.map(property => ({
            ...property,
            isActive: Boolean(property.isActive),
            isFeatured: Boolean(property.isFeatured)
        }));

        // Convert `isActive` and `isFeatured` to boolean for vehicles
        const featuredVehicles = vehicles.map(vehicle => ({
            ...vehicle,
            isActive: Boolean(vehicle.isActive),
            isFeatured: Boolean(vehicle.isFeatured)
        }));

        // Combine properties and vehicles into a single array
        const combinedData = [...featuredProperties, ...featuredVehicles];

        return {
          data: combinedData.sort((a, b) => a.name.localeCompare(b.name)),
      };

    } catch (error) {
        console.error('Error fetching featured listings:', error.message);
        throw new Error('Unable to retrieve featured listings');
    }
  }      

  async getRentalTypeName(rentalTypeID) {
    try {
      // Query to get the rental type name
      const [result] = await db.query(
        `SELECT name FROM rentalType WHERE id = ? AND isActive = 1`,
        [rentalTypeID]
      );

      // If no result is found, return null
      if (!result || result.length === 0) {
        return null;
      }

      // Return the rental type name
      return result[0].name;
    } catch (error) {
      console.error('Error fetching rental type name:', error.message);
      throw new Error('Unable to retrieve rental type name');
    }
  }
}

module.exports = new CommonRepository();