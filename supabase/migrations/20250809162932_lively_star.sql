/*
  # Admin Portal Database Schema Updates

  1. New Tables
    - `roles` - Define system roles (SUPER_ADMIN, ADMIN)
    - `permissions` - Define system permissions
    - `role_permissions` - Map roles to permissions
    - `password_reset_tokens` - Handle password reset functionality

  2. Schema Changes
    - Add `role_id` to admin table
    - Remove `isSuperAdmin` column from admin table

  3. Security
    - Enable proper role-based access control
    - JWT token management
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  isActive BIT(1) NOT NULL DEFAULT 1,
  createdBy INT,
  createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy INT,
  updatedDate DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  module VARCHAR(50) NOT NULL,
  isActive BIT(1) NOT NULL DEFAULT 1,
  createdBy INT,
  createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy INT,
  updatedDate DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  createdBy INT,
  createdDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin(id) ON DELETE CASCADE
);

-- Insert default roles
INSERT INTO roles (name, description, createdBy) VALUES 
('SUPER_ADMIN', 'Super Administrator with full system access', 1),
('ADMIN', 'Administrator with limited system access', 1)
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Insert permissions
INSERT INTO permissions (code, name, description, module, createdBy) VALUES 
-- Admin Management
('admin.view', 'View Admins', 'View admin users', 'admin', 1),
('admin.create', 'Create Admin', 'Create new admin users', 'admin', 1),
('admin.update', 'Update Admin', 'Update admin users', 'admin', 1),
('admin.delete', 'Delete Admin', 'Delete admin users', 'admin', 1),
('admin.manage_roles', 'Manage Admin Roles', 'Assign roles to admin users', 'admin', 1),

-- Vehicle Management
('vehicle.view', 'View Vehicles', 'View vehicle listings', 'vehicle', 1),
('vehicle.create', 'Create Vehicle', 'Create new vehicle listings', 'vehicle', 1),
('vehicle.update', 'Update Vehicle', 'Update vehicle listings', 'vehicle', 1),
('vehicle.delete', 'Delete Vehicle', 'Delete vehicle listings', 'vehicle', 1),
('vehicle.manage_availability', 'Manage Vehicle Availability', 'Manage vehicle availability', 'vehicle', 1),

-- Property Management
('property.view', 'View Properties', 'View property listings', 'property', 1),
('property.create', 'Create Property', 'Create new property listings', 'property', 1),
('property.update', 'Update Property', 'Update property listings', 'property', 1),
('property.delete', 'Delete Property', 'Delete property listings', 'property', 1),
('property.manage_availability', 'Manage Property Availability', 'Manage property availability', 'property', 1),

-- Inquiry Management
('inquiry.view', 'View Inquiries', 'View customer inquiries', 'inquiry', 1),
('inquiry.update', 'Update Inquiry', 'Update inquiry status and remarks', 'inquiry', 1),
('inquiry.delete', 'Delete Inquiry', 'Delete inquiries', 'inquiry', 1),

-- Feature Management
('feature.view', 'View Features', 'View features', 'feature', 1),
('feature.create', 'Create Feature', 'Create new features', 'feature', 1),
('feature.update', 'Update Feature', 'Update features', 'feature', 1),
('feature.delete', 'Delete Feature', 'Delete features', 'feature', 1),

-- System Management
('system.view_dashboard', 'View Dashboard', 'View admin dashboard', 'system', 1),
('system.view_reports', 'View Reports', 'View system reports', 'system', 1),
('system.manage_settings', 'Manage Settings', 'Manage system settings', 'system', 1)

ON DUPLICATE KEY UPDATE 
name = VALUES(name), 
description = VALUES(description), 
module = VALUES(module);

-- Assign permissions to SUPER_ADMIN (all permissions)
INSERT INTO role_permissions (role_id, permission_id, createdBy)
SELECT 
  (SELECT id FROM roles WHERE name = 'SUPER_ADMIN'),
  p.id,
  1
FROM permissions p
WHERE NOT EXISTS (
  SELECT 1 FROM role_permissions rp 
  WHERE rp.role_id = (SELECT id FROM roles WHERE name = 'SUPER_ADMIN') 
  AND rp.permission_id = p.id
);

-- Assign limited permissions to ADMIN
INSERT INTO role_permissions (role_id, permission_id, createdBy)
SELECT 
  (SELECT id FROM roles WHERE name = 'ADMIN'),
  p.id,
  1
FROM permissions p
WHERE p.code IN (
  'vehicle.view', 'vehicle.update', 'vehicle.manage_availability',
  'property.view', 'property.update', 'property.manage_availability',
  'inquiry.view', 'inquiry.update',
  'feature.view',
  'system.view_dashboard'
)
AND NOT EXISTS (
  SELECT 1 FROM role_permissions rp 
  WHERE rp.role_id = (SELECT id FROM roles WHERE name = 'ADMIN') 
  AND rp.permission_id = p.id
);

-- Add role_id column to admin table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin' AND column_name = 'role_id'
  ) THEN
    ALTER TABLE admin ADD COLUMN role_id INT;
    ALTER TABLE admin ADD FOREIGN KEY (role_id) REFERENCES roles(id);
  END IF;
END $$;

-- Update existing admin with SUPER_ADMIN role
UPDATE admin 
SET role_id = (SELECT id FROM roles WHERE name = 'SUPER_ADMIN')
WHERE role_id IS NULL AND isSuperAdmin = 1;

UPDATE admin 
SET role_id = (SELECT id FROM roles WHERE name = 'ADMIN')
WHERE role_id IS NULL AND isSuperAdmin = 0;

-- Remove isSuperAdmin column (uncomment when ready)
-- ALTER TABLE admin DROP COLUMN isSuperAdmin;