/**
 * routes/orders.js
 *
 * Authenticated (any role):
 *   POST /api/orders             – create order (inventory guardrail + transaction)
 *   GET  /api/orders/me          – customer's own order history
 *   GET  /api/orders/:id         – single order (own order or admin)
 *
 * Admin-only:
 *   GET   /api/orders            – all orders with filters
 *   PATCH /api/orders/:id/status – update status
 */

const router = require('express').Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const { verifyToken } = require('../middleware/auth');
const { isAdmin }     = require('../middleware/isAdmin');

// ── Authenticated customers & admins ─────────────────────────────────────────
router.post('/',    verifyToken,         createOrder);
router.get( '/me',  verifyToken,         getMyOrders);   // ← BEFORE /:id
router.get( '/:id', verifyToken,         getOrderById);

// ── Admin-only ────────────────────────────────────────────────────────────────
router.get(   '/',          verifyToken, isAdmin, getAllOrders);
router.patch( '/:id/status', verifyToken, isAdmin, updateOrderStatus);

module.exports = router;
