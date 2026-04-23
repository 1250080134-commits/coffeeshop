/**
 * middleware/auth.js
 *
 * verifyToken  — Checks the Authorization header for a valid Bearer JWT.
 *                Attaches the decoded payload to req.user on success.
 *
 * Usage:
 *   router.get('/protected', verifyToken, handler);
 */

const jwt = require('jsonwebtoken');

/**
 * Extracts and verifies the JWT from the `Authorization: Bearer <token>` header.
 *
 * On success  → calls next() with req.user = { id, username, role, iat, exp }
 * On failure  → responds with 401 Unauthorized
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization header provided.',
    });
  }

  // Expect format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization format. Use: Bearer <token>',
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // { id, username, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed token.',
    });
  }
};

module.exports = { verifyToken };
