/**
 * routes/index.js — Master router
 * Mounts all sub-routers under /api
 */

const router = require('express').Router();

router.use('/auth',       require('./auth'));
router.use('/categories', require('./categories'));
router.use('/products',   require('./products'));
router.use('/orders',     require('./orders'));
router.use('/users',      require('./users'));

module.exports = router;
