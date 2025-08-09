const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

class AuthMiddleware {
  // Verify JWT token
  async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Access token required'
        });
      }

      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get fresh admin data with role and permissions
        const admin = await authRepository.getAdminWithPermissions(decoded.id);
        
        if (!admin || !admin.isActive) {
          return res.status(401).json({
            success: false,
            error: 'Invalid or inactive user'
          });
        }

        req.user = admin;
        next();
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            error: 'Token expired'
          });
        }
        
        return res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        error: 'Authentication error'
      });
    }
  }

  // Check if user has required permission
  requirePermission(permissionCode) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const hasPermission = req.user.permissions.some(
        permission => permission.code === permissionCode
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      next();
    };
  }

  // Check if user has required role
  requireRole(roleName) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      if (req.user.role !== roleName) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient role privileges'
        });
      }

      next();
    };
  }

  // Check if user has any of the required permissions
  requireAnyPermission(permissionCodes) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const hasAnyPermission = permissionCodes.some(code =>
        req.user.permissions.some(permission => permission.code === code)
      );

      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      next();
    };
  }

  // Super admin only
  requireSuperAdmin() {
    return this.requireRole('SUPER_ADMIN');
  }
}

module.exports = new AuthMiddleware();