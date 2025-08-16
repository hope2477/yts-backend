const db = require('../config/database');

class VehicleRepository {
  // Admin-specific methods for vehicle management
  async getAllVehiclesForAdmin({ page, limit, search, isFeatured }) {
    try {
      let query = `
        SELECT 
          v.id, 
          v.make, 
          v.model, 
          v.NumberPlate,
          v.bodyStyle, 
          v.transmission, 
          v.fuelType, 
          v.vehicleClass, 
          v.numOfPassengers, 
          v.isFeatured, 
          v.image,
          CASE 
            WHEN NOT EXISTS (
              SELECT 1 
              FROM vehicleAvailability va 
              WHERE va.vehicleId = v.id 
              AND va.startDate <= NOW() 
              AND va.endDate >= NOW()
            ) THEN 'AVAILABLE'
            ELSE 'UNAVAILABLE'
          END AS status
        FROM vehicle v
        WHERE v.isActive = 1
      `;
      
      const params = [];
      
      if (search) {
        query += ' AND (CONCAT(v.make, " ", v.model) LIKE ? OR v.NumberPlate LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }
      
      if (isFeatured !== undefined) {
        query += ' AND v.isFeatured = ?';
        params.push(isFeatured ? 1 : 0);
      }
      
      // Count total records
      const countQuery = query.replace(
        /SELECT.*FROM/s, 'SELECT COUNT(*) as total FROM'
      );
      const [countResult] = await db.query(countQuery, params);
      const total = countResult[0].total;
      
      // Add pagination
      query += ' ORDER BY v.createdDate DESC LIMIT ? OFFSET ?';
      params.push(limit, (page - 1) * limit);
      
      const [rows] = await db.query(query, params);
      
      return {
        data: rows.map(row => ({
          ...row,
          isFeatured: Boolean(row.isFeatured)
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching vehicles for admin:', error.message);
      throw new Error('Unable to retrieve vehicles');
    }
  }

  async getVehicleByIdForAdmin(id) {
    try {
      // Get vehicle details
      const [vehicleRows] = await db.query(`
        SELECT v.*, rt.name as rentalTypeName
        FROM vehicle v
        JOIN rentalType rt ON v.rentalTypeId = rt.id
        WHERE v.id = ?
      `, [id]);
      
      if (vehicleRows.length === 0) return null;
      
      const vehicle = vehicleRows[0];
      
      // Get features
      const [featureRows] = await db.query(`
        SELECT f.id, f.name
        FROM vehicleFeature vf
        JOIN feature f ON vf.featureId = f.id
        WHERE vf.vehicleId = ?
      `, [id]);
      
      // Get images
      const [imageRows] = await db.query(`
        SELECT image
        FROM vehicleImages
        WHERE vehicleID = ?
        ORDER BY numID
      `, [id]);
      
      // Get availability
      const [availabilityRows] = await db.query(`
        SELECT startDate, endDate
        FROM vehicleAvailability
        WHERE vehicleId = ?
        ORDER BY startDate
      `, [id]);
      
      return {
        ...vehicle,
        isActive: Boolean(vehicle.isActive),
        isFeatured: Boolean(vehicle.isFeatured),
        features: featureRows,
        images: imageRows.map(row => row.image),
        availability: availabilityRows
      };
    } catch (error) {
      console.error('Error fetching vehicle by ID for admin:', error.message);
      throw new Error('Unable to retrieve vehicle');
    }
  }

  async createVehicle(vehicleData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert vehicle with main image
      const [result] = await connection.query(`
        INSERT INTO vehicle (
          make, model, year, fuelType, transmission, numOfPassengers, 
          vehicleClass, description, color, bodyStyle, dailyCharge, 
          weeklyCharge, monthlyCharge, NumberPlate, image, isFeatured, 
          isActive, createdBy, createdDate, rentalTypeId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `, [
        vehicleData.make,
        vehicleData.model,
        vehicleData.year || null,
        vehicleData.fuelType,
        vehicleData.transmission,
        vehicleData.numOfPassengers,
        vehicleData.vehicleClass,
        vehicleData.description || '',
        vehicleData.color || '',
        vehicleData.bodyStyle,
        vehicleData.dailyCharge,
        vehicleData.weeklyCharge || 0,
        vehicleData.monthlyCharge || 0,
        vehicleData.NumberPlate || '',
        vehicleData.image || '', // Main image from first image in array
        vehicleData.isFeatured || false,
        vehicleData.isActive !== undefined ? vehicleData.isActive : true,
        vehicleData.createdBy, // From authenticated user
        1 // rentalTypeId for vehicles
      ]);
      
      const vehicleId = result.insertId;
      
      // Insert features if provided
      if (vehicleData.features && vehicleData.features.length > 0) {
        const featureValues = vehicleData.features.map(featureId => [vehicleId, featureId]);
        await connection.query(`
          INSERT INTO vehicleFeature (vehicleId, featureId) VALUES ?
        `, [featureValues]);
      }
      
      // Insert additional images if provided (skip first one as it's the main image)
      if (vehicleData.images && vehicleData.images.length > 1) {
        const additionalImages = vehicleData.images.slice(1);
        const imageValues = additionalImages.map(image => [vehicleId, image]);
        await connection.query(`
          INSERT INTO vehicleImages (vehicleID, image) VALUES ?
        `, [imageValues]);
      }
      
      // Insert availability dates if provided
      if (vehicleData.availability && vehicleData.availability.length > 0) {
        const availabilityValues = vehicleData.availability.map(avail => [
          vehicleId, 
          avail.startDate, 
          avail.endDate, 
          vehicleData.createdBy,
          new Date() // createdDate
        ]);
        await connection.query(`
          INSERT INTO vehicleAvailability (vehicleId, startDate, endDate, createdBy, createdDate) 
          VALUES ?
        `, [availabilityValues]);
      }
      
      await connection.commit();
      return vehicleId;
    } catch (error) {
      await connection.rollback();
      console.error('Error creating vehicle:', error.message);
      throw new Error('Unable to create vehicle');
    } finally {
      connection.release();
    }
  }

  async updateVehicle(id, updateData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Validate features exist if provided
      if (updateData.features !== undefined && updateData.features.length > 0) {
        const [existingFeatures] = await connection.query(
          'SELECT id FROM feature WHERE id IN (?)', 
          [updateData.features]
        );
        
        const existingFeatureIds = existingFeatures.map(f => f.id);
        const invalidFeatures = updateData.features.filter(
          f => !existingFeatureIds.includes(f)
        );
        
        if (invalidFeatures.length > 0) {
          throw new Error(`Invalid feature IDs: ${invalidFeatures.join(', ')}`);
        }
      }

      // Update vehicle - ensure image is never null
      const [result] = await connection.query(`
        UPDATE vehicle 
        SET make = ?, model = ?, year = ?, fuelType = ?, transmission = ?, 
            numOfPassengers = ?, vehicleClass = ?, description = ?, color = ?, 
            bodyStyle = ?, dailyCharge = ?, weeklyCharge = ?, monthlyCharge = ?, 
            NumberPlate = ?, image = COALESCE(?, image), isFeatured = ?, isActive = ?, 
            updatedBy = ?, updatedDate = NOW()
        WHERE id = ?
      `, [
        updateData.make,
        updateData.model,
        updateData.year,
        updateData.fuelType,
        updateData.transmission,
        updateData.numOfPassengers,
        updateData.vehicleClass,
        updateData.description,
        updateData.color,
        updateData.bodyStyle,
        updateData.dailyCharge,
        updateData.weeklyCharge,
        updateData.monthlyCharge,
        updateData.NumberPlate,
        updateData.image, // Will use existing image if null
        updateData.isFeatured,
        updateData.isActive,
        updateData.updatedBy,
        id
      ]);
      
      // Update features if provided (replaces all existing)
      if (updateData.features !== undefined) {
        await connection.query('DELETE FROM vehicleFeature WHERE vehicleId = ?', [id]);
        
        if (updateData.features.length > 0) {
          const featureValues = updateData.features.map(featureId => [id, featureId]);
          await connection.query(`
            INSERT INTO vehicleFeature (vehicleId, featureId) VALUES ?
          `, [featureValues]);
        }
      }
      
      // Update images if provided (replaces all existing)
      if (updateData.images !== undefined) {
        await connection.query('DELETE FROM vehicleImages WHERE vehicleID = ?', [id]);
        
        if (updateData.images.length > 0) {
          const imageValues = updateData.images.map(image => [id, image]);
          await connection.query(`
            INSERT INTO vehicleImages (vehicleID, image) VALUES ?
          `, [imageValues]);
        }
      }
      
      // Update availability if provided (replaces all existing)
      if (updateData.availability !== undefined) {
        await connection.query('DELETE FROM vehicleAvailability WHERE vehicleId = ?', [id]);
        
        if (updateData.availability.length > 0) {
          const availabilityValues = updateData.availability.map(avail => [
            id, 
            avail.startDate, 
            avail.endDate, 
            updateData.updatedBy, 
            new Date()
          ]);
          await connection.query(`
            INSERT INTO vehicleAvailability (vehicleId, startDate, endDate, createdBy, createdDate) 
            VALUES ?
          `, [availabilityValues]);
        }
      }
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error('Error updating vehicle:', {
        message: error.message,
        sqlMessage: error.sqlMessage,
        stack: error.stack
      });
      throw new Error('Unable to update vehicle: ' + error.message);
    } finally {
      connection.release();
    }
  }

  async deleteVehicle(id, userId) {
    try {
      const [result] = await db.query(`
        UPDATE vehicle 
        SET isActive = 0, isFeatured = 0, updatedBy = ?, updatedDate = NOW()
        WHERE id = ?
      `, [userId, id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting vehicle:', error.message);
      throw new Error('Unable to delete vehicle');
    }
  }

  async updateVehicleAvailability(id, availability, userId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Delete existing availability
      await connection.query('DELETE FROM vehicleAvailability WHERE vehicleId = ?', [id]);
      
      // Insert new availability
      if (availability && availability.length > 0) {
        const availabilityValues = availability.map(avail => [
          id, avail.startDate, avail.endDate, userId, new Date()
        ]);
        await connection.query(`
          INSERT INTO vehicleAvailability (vehicleId, startDate, endDate, createdBy, createdDate) 
          VALUES ?
        `, [availabilityValues]);
      }
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('Error updating vehicle availability:', error.message);
      throw new Error('Unable to update vehicle availability');
    } finally {
      connection.release();
    }
  }

  async getVehicleFeatures(search) {
    try {
      let query = `
        SELECT f.id, f.name
        FROM feature f
        WHERE f.rentalId = 1 AND f.isActive = 1
      `;
      const params = [];

      if (search) {
        query += ` AND f.name LIKE ?`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY f.name`;

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error fetching vehicle features:', error.message);
      throw new Error('Unable to retrieve vehicle features');
    }
  }

  async updateVehicleFeaturedStatus(id, isFeatured, userId) {
    try {
        // First check if we're trying to feature an inactive vehicle
        if (isFeatured) {
            const [activeCheck] = await db.query(
                'SELECT isActive FROM vehicle WHERE id = ?',
                [id]
            );
            
            if (!activeCheck.length || !activeCheck[0].isActive) {
                return false; // Prevent featuring inactive vehicles
            }
        }

        const [result] = await db.query(`
            UPDATE vehicle 
            SET isFeatured = ?,
                updatedBy = ?,
                updatedDate = NOW()
            WHERE id = ?
        `, [isFeatured ? 1 : 0, userId, id]);
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating vehicle featured status:', error.message);
        throw error;
    }
  }

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
