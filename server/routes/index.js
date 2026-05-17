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
<<<<<<< HEAD
router.use('/guides',     require('./guides'));
=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74

module.exports = router;
