/**
 * routes/guides.js
 *
 * Public:
 *   GET /api/guides           – all guides (sorted by sort_order)
 *   GET /api/guides/featured  – featured only  ← MUST be before /:slug
 *   GET /api/guides/:slug     – single guide by slug
 *
 * Admin-only:
 *   POST   /api/guides        – create
 *   PUT    /api/guides/:slug  – update
 *   DELETE /api/guides/:slug  – delete
 */

const router = require('express').Router();

const {
  getAllGuides,
  getFeaturedGuides,
  getGuideBySlug,
  createGuide,
  updateGuide,
  deleteGuide,
} = require('../controllers/brewingGuideController');

const { verifyToken } = require('../middleware/auth');
const { isAdmin }     = require('../middleware/isAdmin');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/',          getAllGuides);
router.get('/featured',  getFeaturedGuides);   // ← BEFORE /:slug
router.get('/:slug',     getGuideBySlug);

// ── Admin-only ────────────────────────────────────────────────────────────────
router.post(  '/',       verifyToken, isAdmin, createGuide);
router.put(   '/:slug',  verifyToken, isAdmin, updateGuide);
router.delete('/:slug',  verifyToken, isAdmin, deleteGuide);

module.exports = router;
