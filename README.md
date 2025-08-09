# YTS Enterprise Admin Portal Backend

A comprehensive Node.js/Express backend API for the YTS Enterprise admin portal with JWT authentication, role-based access control, and complete CRUD operations.

## Features

- **JWT Authentication** with 2-hour token expiry
- **Role-Based Access Control (RBAC)** with SUPER_ADMIN and ADMIN roles
- **Permission-based Authorization** for granular access control
- **Complete Admin Portal APIs** for vehicles, properties, inquiries, and features
- **Dashboard Analytics** with statistics and reports
- **Password Reset** functionality with email notifications
- **Soft Delete** operations for data integrity
- **Pagination** support for large datasets
- **Input Validation** and error handling

## Database Schema

### New Tables Added:
- `roles` - System roles (SUPER_ADMIN, ADMIN)
- `permissions` - System permissions by module
- `role_permissions` - Role-permission mappings
- `password_reset_tokens` - Password reset token management

### Schema Updates:
- Added `role_id` to `admin` table
- Removed `isSuperAdmin` column (replaced by role-based system)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login with JWT token
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/register-admin` - Register new admin (SUPER_ADMIN only)
- `GET /api/auth/admins` - Get all admins
- `GET /api/auth/roles` - Get all roles
- `GET /api/auth/roles/:roleId/permissions` - Get role permissions
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/recent-inquiries` - Recent inquiries
- `GET /api/admin/dashboard/monthly-stats` - Monthly statistics
- `GET /api/admin/dashboard/popular-vehicles` - Popular vehicles
- `GET /api/admin/dashboard/popular-properties` - Popular properties

### Vehicle Management
- `GET /api/admin/vehicles` - Get all vehicles (with pagination)
- `GET /api/admin/vehicles/:id` - Get vehicle by ID
- `POST /api/admin/vehicles` - Create new vehicle
- `PUT /api/admin/vehicles/:id` - Update vehicle
- `DELETE /api/admin/vehicles/:id` - Delete vehicle (soft delete)
- `PUT /api/admin/vehicles/:id/availability` - Update vehicle availability
- `GET /api/admin/vehicle-features` - Get vehicle features

### Property Management
- `GET /api/admin/properties` - Get all properties (with pagination)
- `GET /api/admin/properties/:id` - Get property by ID
- `POST /api/admin/properties` - Create new property
- `PUT /api/admin/properties/:id` - Update property
- `DELETE /api/admin/properties/:id` - Delete property (soft delete)
- `PUT /api/admin/properties/:id/availability` - Update property availability
- `GET /api/admin/property-features` - Get property features

### Inquiry Management
- `GET /api/admin/inquiries` - Get all inquiries (with filters)
- `GET /api/admin/inquiries/:id` - Get inquiry by ID
- `PUT /api/admin/inquiries/:id/status` - Update inquiry status
- `DELETE /api/admin/inquiries/:id` - Delete inquiry
- `GET /api/admin/inquiry-stats` - Get inquiry statistics

### Feature Management
- `GET /api/admin/features` - Get all features
- `GET /api/admin/features/:id` - Get feature by ID
- `POST /api/admin/features` - Create new feature
- `PUT /api/admin/features/:id` - Update feature
- `DELETE /api/admin/features/:id` - Delete feature (soft delete)

## Permissions System

### Modules:
- **admin** - Admin user management
- **vehicle** - Vehicle management
- **property** - Property management
- **inquiry** - Inquiry management
- **feature** - Feature management
- **system** - System-level operations

### Permission Codes:
- `admin.view`, `admin.create`, `admin.update`, `admin.delete`, `admin.manage_roles`
- `vehicle.view`, `vehicle.create`, `vehicle.update`, `vehicle.delete`, `vehicle.manage_availability`
- `property.view`, `property.create`, `property.update`, `property.delete`, `property.manage_availability`
- `inquiry.view`, `inquiry.update`, `inquiry.delete`
- `feature.view`, `feature.create`, `feature.update`, `feature.delete`
- `system.view_dashboard`, `system.view_reports`, `system.manage_settings`

## Role Assignments

### SUPER_ADMIN:
- All permissions across all modules
- Can manage other admins
- Full system access

### ADMIN:
- Limited permissions for day-to-day operations
- Cannot manage other admins
- Cannot delete critical data

## Installation & Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup:**
   ```bash
   # Run the migration script in your MySQL database
   mysql -u username -p database_name < db_migrations.sql
   ```

4. **Start Server:**
   ```bash
   npm start
   ```

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT Secrets (use strong, unique keys)
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Email Configuration
EMAIL_HOST=mail.ytsenterprise.com
EMAIL_PORT=465
EMAIL_USER=info@ytsenterprise.com
EMAIL_PASS=your_email_password
SUPPORT_EMAIL=info@ytsenterprise.com

# Frontend URL
FRONTEND_URL=https://admin.ytsenterprise.com
```

## Authentication Flow

1. **Login:** POST to `/api/auth/login` with email/password
2. **Response:** JWT token + refresh token + user permissions
3. **API Calls:** Include `Authorization: Bearer <token>` header
4. **Token Refresh:** Use refresh token when JWT expires (2 hours)

## Security Features

- **JWT tokens** with 2-hour expiry
- **Refresh tokens** for seamless re-authentication
- **Password hashing** with bcrypt
- **Role-based access control**
- **Permission-based authorization**
- **Input validation** and sanitization
- **Soft delete** for data integrity
- **Audit trails** with created/updated tracking

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

Success responses:
```json
{
  "success": true,
  "data": { ... }
}
```

## Development Notes

- All admin routes require authentication
- Permissions are checked on each protected endpoint
- Soft deletes are used to maintain data integrity
- Pagination is implemented for large datasets
- Audit trails track all modifications
- Email notifications for password resets

This backend provides a complete foundation for the YTS Enterprise admin portal with enterprise-grade security and functionality.