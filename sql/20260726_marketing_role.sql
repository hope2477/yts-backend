-- =============================================================================
-- MARKETING role: blog-only access for marketing users
-- Run after blog permissions exist (sql/20260725_blog.sql)
-- =============================================================================
-- Example:
--   mysql -u USER -p DATABASE < sql/20260726_marketing_role.sql
-- =============================================================================

INSERT INTO roles (name, description, isActive, createdBy, createdDate)
SELECT 'MARKETING', 'Marketing — blog management only', 1, 1, NOW()
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'MARKETING');

-- Ensure blog permissions exist (safe if already seeded)
INSERT INTO permissions (code, name, description, module, createdBy) VALUES
('blog.view', 'View Blogs', 'View blog posts', 'blog', 1),
('blog.create', 'Create Blog', 'Create blog posts', 'blog', 1),
('blog.update', 'Update Blog', 'Update blog posts', 'blog', 1),
('blog.delete', 'Delete Blog', 'Delete blog posts', 'blog', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  module = VALUES(module);

-- MARKETING gets only blog CRUD
INSERT INTO role_permissions (role_id, permission_id, createdBy)
SELECT
  (SELECT id FROM roles WHERE name = 'MARKETING'),
  p.id,
  1
FROM permissions p
WHERE p.code IN ('blog.view', 'blog.create', 'blog.update', 'blog.delete')
AND NOT EXISTS (
  SELECT 1 FROM role_permissions rp
  WHERE rp.role_id = (SELECT id FROM roles WHERE name = 'MARKETING')
    AND rp.permission_id = p.id
);
