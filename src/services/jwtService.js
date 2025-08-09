const jwt = require('jsonwebtoken');

class JWTService {
  generateToken(admin) {
    const payload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions.map(p => p.code)
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h',
      issuer: 'yts-enterprise',
      audience: 'yts-admin'
    });
  }

  generateRefreshToken(adminId) {
    return jwt.sign(
      { id: adminId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = new JWTService();