/**
 * middleware/isAdmin.js
 *
 * Must be used AFTER verifyToken — it assumes req.user has already been populated.
 *
 * Allows only users whose role === 'Admin' to proceed.
 * Customers receive 403 Forbidden.
 *
 * Usage:
 *   router.post('/products', verifyToken, isAdmin, createProduct);
 */

const isAdmin = (req, res, next) => {
  if (!req.user) {
    // Guard: verifyToken should have run first
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admin access only.',
    });
  }

  next();
};

module.exports = { isAdmin };
