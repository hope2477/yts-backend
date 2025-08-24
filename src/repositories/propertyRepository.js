const db = require('../config/database');
const imageUploadHelper = require('../utils/imageUploadHelper')

class PropertyRepository {
    // Admin-specific methods for property management
    async getAllPropertiesForAdmin({ page, limit, search, status, isFeatured }) {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            
            let query = `
                SELECT 
                    p.id, 
                    p.name, 
                    p.address, 
                    p.propertyType, 
                    p.propertyClass,
                    p.numOfBedrooms, 
                    p.numOfBathrooms, 
                    p.numOfVehicleParking,
                    p.image,
                    p.isFeatured,
                    CASE 
                        WHEN (
                            SELECT COUNT(*) 
                            FROM propertyAvailability pa 
                            WHERE pa.propertyID = p.id 
                            AND ? BETWEEN pa.startDate AND pa.endDate
                        ) > 0 THEN 'Not Available'
                        ELSE 'Available'
                    END AS status
                FROM property p
                WHERE 1=1
            `;
            
            const params = [currentDate];
            
            // Search filter (name or address)
            if (search) {
                query += ' AND (p.name LIKE ? OR p.address LIKE ?)';
                params.push(`%${search}%`, `%${search}%`);
            }
            
            // Featured filter
            if (isFeatured !== undefined) {
                query += ' AND p.isFeatured = ?';
                params.push(isFeatured ? 1 : 0);
            }
            
            // Status filter (isActive)
            if (status !== undefined) {
                query += ' AND p.isActive = ?';
                params.push(status === 'active' ? 1 : 0);
            }
            
            // Count total records
            const countQuery = query.replace(
                /SELECT.*FROM/s, 
                'SELECT COUNT(*) as total FROM'
            );
            
            const [countResult] = await db.query(countQuery, params);
            const total = countResult[0].total;
            const pages = Math.ceil(total / limit);
            
            // Add pagination
            query += ' ORDER BY p.createdDate DESC LIMIT ? OFFSET ?';
            params.push(limit, (page - 1) * limit);
            
            const [rows] = await db.query(query, params);
            
            return {
                data: rows.map(row => ({
                    id: row.id,
                    name: row.name,
                    address: row.address,
                    propertyType: row.propertyType,
                    propertyClass: row.propertyClass,
                    numOfBedrooms: row.numOfBedrooms,
                    numOfBathrooms: row.numOfBathrooms,
                    numOfVehicleParking: row.numOfVehicleParking,
                    isFeatured: Boolean(row.isFeatured),
                    status: row.status,
                    image: imageUploadHelper.getImageUrl(row.image)
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    pages
                }
            };
        } catch (error) {
            console.error('Error fetching properties for admin:', error.message);
            throw new Error('Unable to retrieve properties');
        }
    }

    async getPropertyByIdForAdmin(id) {
        try {
            // Get property details
            const [propertyRows] = await db.query(`
                SELECT p.*, rt.name as rentalTypeName
                FROM property p
                JOIN rentalType rt ON p.rentalTypeID = rt.id
                WHERE p.id = ?
            `, [id]);
            
            if (propertyRows.length === 0) return null;
            
            const property = propertyRows[0];
            
            // Get features
            const [featureRows] = await db.query(`
                SELECT f.id, f.name
                FROM propertyfeatures pf
                JOIN feature f ON pf.featureID = f.id
                WHERE pf.propertyID = ?
            `, [id]);
            
            // Get images
            const [imageRows] = await db.query(`
                SELECT image
                FROM propertyImages
                WHERE propertyID = ?
                ORDER BY numID
            `, [id]);
            
            // Get availability
            const [availabilityRows] = await db.query(`
                SELECT startDate, endDate
                FROM propertyAvailability
                WHERE propertyID = ?
                ORDER BY startDate
            `, [id]);
            
            return {
                ...property,
                isActive: Boolean(property.isActive),
                isFeatured: Boolean(property.isFeatured),
                features: featureRows,
                image: imageUploadHelper.getImageUrl(property.image), // Add this line
                images: imageRows.map(row => imageUploadHelper.getImageUrl(row.image)), // Add this
                availability: availabilityRows
            };
        } catch (error) {
            console.error('Error fetching property by ID for admin:', error.message);
            throw new Error('Unable to retrieve property');
        }
    }

    async createProperty(propertyData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // Insert property
            const [result] = await connection.query(`
                INSERT INTO property (
                    name, address, propertyType, propertyClass, numOfBedrooms,
                    numOfBathrooms, numOfVehicleParking, description, furnishDetails,
                    floor, dailyCharge, weeklyCharge, monthlyCharge, image,
                    isFeatured, isActive, createdBy, createdDate, rentalTypeID
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
            `, [
                propertyData.name,
                propertyData.address,
                propertyData.propertyType,
                propertyData.propertyClass,
                propertyData.numOfBedrooms,
                propertyData.numOfBathrooms,
                propertyData.numOfVehicleParking || 0,
                propertyData.description || '',
                propertyData.furnishDetails || '',
                propertyData.floor || null,
                propertyData.dailyCharge || null,
                propertyData.weeklyCharge || null,
                propertyData.monthlyCharge || null,
                propertyData.image || '',
                propertyData.isFeatured || false,
                propertyData.isActive !== undefined ? propertyData.isActive : true,
                propertyData.createdBy,
                propertyData.rentalTypeID
            ]);
            
            const propertyId = result.insertId;
            
            // Insert features if provided
            if (propertyData.features && propertyData.features.length > 0) {
                const featureValues = propertyData.features.map(featureId => [propertyId, featureId]);
                await connection.query(`
                    INSERT INTO propertyfeatures (propertyID, featureID) VALUES ?
                `, [featureValues]);
            }
            
            // Insert images if provided
            if (propertyData.images && propertyData.images.length > 0) {
                const imageValues = propertyData.images.map(image => [propertyId, image]);
                await connection.query(`
                    INSERT INTO propertyImages (propertyID, image) VALUES ?
                `, [imageValues]);
            }
            
            // Insert availability dates if provided
            if (propertyData.availability && propertyData.availability.length > 0) {
                const availabilityValues = propertyData.availability.map(avail => [
                    propertyId, avail.startDate, avail.endDate, propertyData.createdBy, new Date()
                ]);
                await connection.query(`
                    INSERT INTO propertyAvailability (propertyID, startDate, endDate, createdBy, createdDate) 
                    VALUES ?
                `, [availabilityValues]);
            }
            
            await connection.commit();
            return propertyId;
        } catch (error) {
            await connection.rollback();
            console.error('Error creating property:', error.message);
            throw new Error('Unable to create property');
        } finally {
            connection.release();
        }
    }

    async updateProperty(id, updateData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Update main property info
            const [result] = await connection.query(
            `UPDATE property
            SET name=?, address=?, propertyType=?, propertyClass=?,
                numOfBedrooms=?, numOfBathrooms=?, numOfVehicleParking=?,
                description=?, furnishDetails=?, floor=?, dailyCharge=?,
                weeklyCharge=?, monthlyCharge=?, image=?, isFeatured=?,
                updatedBy=?, updatedDate=NOW()
            WHERE id=?`,
            [
                updateData.name,
                updateData.address,
                updateData.propertyType,
                updateData.propertyClass,
                updateData.numOfBedrooms,
                updateData.numOfBathrooms,
                updateData.numOfVehicleParking || 0,
                updateData.description || '',
                updateData.furnishDetails || '',
                updateData.floor || null,
                updateData.dailyCharge || null,
                updateData.weeklyCharge || null,
                updateData.monthlyCharge || null,
                updateData.image, // always first processed image
                updateData.isFeatured || false,
                updateData.updatedBy,
                id
            ]
            );

            // Update features
            if (updateData.features !== undefined) {
            await connection.query('DELETE FROM propertyfeatures WHERE propertyID=?', [id]);
            if (updateData.features.length > 0) {
                const featureValues = updateData.features.map(fId => [id, fId]);
                await connection.query('INSERT INTO propertyfeatures (propertyID, featureID) VALUES ?', [featureValues]);
            }
            }

            // Update images
            if (updateData.images !== undefined) {
            await connection.query('DELETE FROM propertyImages WHERE propertyID=?', [id]);
            if (updateData.images.length > 0) {
                const imageValues = updateData.images.map(img => [id, img]);
                await connection.query('INSERT INTO propertyImages (propertyID, image) VALUES ?', [imageValues]);
            }
            }

            // Update availability
            if (updateData.availability !== undefined) {
            await connection.query('DELETE FROM propertyAvailability WHERE propertyID=?', [id]);
            if (updateData.availability.length > 0) {
                const availabilityValues = updateData.availability.map(avail => [
                id,
                avail.startDate,
                avail.endDate,
                updateData.updatedBy,
                new Date()
                ]);
                await connection.query(
                `INSERT INTO propertyAvailability (propertyID, startDate, endDate, createdBy, createdDate) VALUES ?`,
                [availabilityValues]
                );
            }
            }

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            console.error('Error updating property:', error);
            throw new Error('Unable to update property: ' + error.message);
        } finally {
            connection.release();
        }
        }


    async deleteProperty(id, userId) {
        try {
            const [result] = await db.query(`
                UPDATE property 
                SET isActive = 0, isFeatured = 0, updatedBy = ?, updatedDate = NOW()
                WHERE id = ?
            `, [userId, id]);
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting property:', error.message);
            throw new Error('Unable to delete property');
        }
    }

    async updatePropertyAvailability(id, availability, userId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // Delete existing availability
            await connection.query('DELETE FROM propertyAvailability WHERE propertyID = ?', [id]);
            
            // Insert new availability
            if (availability && availability.length > 0) {
                const availabilityValues = availability.map(avail => [
                    id, avail.startDate, avail.endDate, userId, new Date()
                ]);
                await connection.query(`
                    INSERT INTO propertyAvailability (propertyID, startDate, endDate, createdBy, createdDate) 
                    VALUES ?
                `, [availabilityValues]);
            }
            
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            console.error('Error updating property availability:', error.message);
            throw new Error('Unable to update property availability');
        } finally {
            connection.release();
        }
    }

    async getPropertyFeatures(search) {
        try {
            let query = `
                SELECT f.id, f.name
                FROM feature f
                WHERE f.rentalId = 2 AND f.isActive = 1
            `;
            
            const params = [];
            
            // Add search filter if provided
            if (search) {
                query += ' AND f.name LIKE ?';
                params.push(`%${search}%`);
            }
            
            query += ' ORDER BY f.name';
            
            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
            console.error('Error fetching property features:', error.message);
            throw new Error('Unable to retrieve property features');
        }
    }

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

    async updatePropertyFeaturedStatus(id, isFeatured, userId) {
        try {
            // First check if we're trying to feature an inactive property
            if (isFeatured) {
                const [activeCheck] = await db.query(
                    'SELECT isActive FROM property WHERE id = ?',
                    [id]
                );
                
                if (!activeCheck.length || !activeCheck[0].isActive) {
                    return false; // Prevent featuring inactive properties
                }
            }

            const [result] = await db.query(`
                UPDATE property 
                SET isFeatured = ?,
                    updatedBy = ?,
                    updatedDate = NOW()
                WHERE id = ?
            `, [isFeatured ? 1 : 0, userId, id]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating property featured status:', error.message);
            throw new Error('Unable to update property featured status');
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
      const images = imageUploadHelper.getImageUrls(imageResult.map(img => img.image));

      const result = {
        ...property,
        isActive: property.isActive === 1,  // Explicitly check for 1
        isFeatured: property.isFeatured === 1,  // Explicitly check for 1
        image: imageUploadHelper.getImageUrl(property.image), // Convert to full URL
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
      // Insert all images (including the main image, store filenames only)
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
        image: imageUploadHelper.getImageUrl(property.image), // Convert to full URL
        images: imageUploadHelper.getImageUrls(imageRows.map(row => row.image)), // Convert to full URLs
        property: updatedProperty[0]
      };
    } catch (error) {
      console.error('Error updating property status:', error.message);
      throw new Error('Unable to update property status');
    }
  }
}
module.exports = new PropertyRepository();