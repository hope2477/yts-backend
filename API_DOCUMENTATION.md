# YTS Enterprise Admin Portal - Image Upload API Documentation

## Image Upload System

The admin portal now supports image uploads through base64 encoding. This allows the frontend to send images as base64 strings, which are then saved to the server filesystem and stored as URLs in the database.

### How It Works

1. **Frontend**: Converts images to base64 strings and sends them in the `base64Images` array
2. **Backend**: Receives base64 strings, saves them as files, and stores the URLs in the database
3. **Storage**: Images are saved in `/images/vehiclesAndProperties/` directory
4. **Database**: Main image URL goes to the `image` column, all image URLs go to respective mapping tables

### API Changes

#### Vehicle Creation/Update
```json
{
  "make": "Toyota",
  "model": "Camry",
  "base64Images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  ],
  // ... other vehicle fields
}
```

#### Property Creation/Update
```json
{
  "name": "Luxury Apartment",
  "address": "123 Main St",
  "base64Images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  ],
  // ... other property fields
}
```

### Image Processing Rules

1. **File Naming**: Images are saved with descriptive names:
   - Vehicles: `vehicle-{identifier}-{timestamp}-{index}.{ext}`
   - Properties: `property-{identifier}-{timestamp}-{index}.{ext}`

2. **Main Image**: First image in the array becomes the main image (stored in `image` column)

3. **All Images**: All images are stored in respective mapping tables (`vehicleImages`, `propertyImages`)

4. **URL Format**: Saved images get URLs like `/images/vehiclesAndProperties/vehicle-CBH7053-1640995200000-1.jpg`

### Validation Rules

- **Supported Formats**: JPEG, PNG, GIF, WebP
- **Maximum Size**: 5MB per image
- **Maximum Count**: 10 images per vehicle/property
- **Required Format**: Must be valid base64 data URL format

### New API Endpoints

#### System Management
```
POST /api/admin/system/cleanup-images
GET /api/admin/system/storage-stats
```

### Error Handling

The system provides detailed error messages for:
- Invalid base64 format
- Unsupported image formats
- File size exceeded
- Too many images
- File system errors

### Example Frontend Implementation

```javascript
// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Upload vehicle with images
async function createVehicle(vehicleData, imageFiles) {
  const base64Images = await Promise.all(
    imageFiles.map(file => fileToBase64(file))
  );
  
  const payload = {
    ...vehicleData,
    base64Images
  };
  
  const response = await fetch('/api/admin/vehicles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  
  return response.json();
}
```

### Storage Management

- **Automatic Cleanup**: When updating images, old images are automatically deleted
- **Manual Cleanup**: Use `/api/admin/system/cleanup-images` to remove orphaned files
- **Storage Stats**: Monitor storage usage with `/api/admin/system/storage-stats`

### Security Considerations

- Images are validated for format and size
- File paths are sanitized to prevent directory traversal
- Only authenticated admins can upload images
- Permission-based access control for image management

This implementation provides a robust, secure, and scalable image upload system that integrates seamlessly with your existing vehicle and property management workflows.