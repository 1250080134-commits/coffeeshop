/**
 * routes/products.js
 *
 * Public:
 *   GET  /api/products               – list with advanced filtering
 *   GET  /api/products/search        – search by name, origin, processing_method
 *   GET  /api/products/:id           – single product detail
 *
 * Admin-only:
 *   POST   /api/products             – create
 *   PUT    /api/products/:id         – update
 *   PATCH  /api/products/:id/stock   – adjust stock
 *   DELETE /api/products/:id         – delete
 *
 * ⚠️  /search MUST be registered before /:id so Express doesn't
 *     interpret the literal string "search" as an id parameter.
 */

const router = require('express').Router();

const {
  getAllProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
} = require('../controllers/productController');

const { verifyToken } = require('../middleware/auth');
const { isAdmin }     = require('../middleware/isAdmin');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/',         getAllProducts);
router.get('/search',   searchProducts);   // ← BEFORE /:id
router.get('/:id',      getProductById);

// ── Admin-only ────────────────────────────────────────────────────────────────
router.post(  '/',             verifyToken, isAdmin, createProduct);
router.put(   '/:id',          verifyToken, isAdmin, updateProduct);
router.patch( '/:id/stock',    verifyToken, isAdmin, adjustStock);
router.delete('/:id',          verifyToken, isAdmin, deleteProduct);

module.exports = router;
