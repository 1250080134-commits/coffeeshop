/**
 * routes/categories.js
 *
 * Public:
 *   GET  /api/categories          – list all
 *   GET  /api/categories/:id      – single with products
 *
 * Admin-only:
 *   POST   /api/categories        – create
 *   PUT    /api/categories/:id    – update
 *   DELETE /api/categories/:id    – delete
 */

const router = require('express').Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const { verifyToken } = require('../middleware/auth');
const { isAdmin }     = require('../middleware/isAdmin');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/',    getAllCategories);
router.get('/:id', getCategoryById);

// ── Admin-only ────────────────────────────────────────────────────────────────
router.post(  '/',    verifyToken, isAdmin, createCategory);
router.put(   '/:id', verifyToken, isAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

module.exports = router;
