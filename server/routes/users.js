/**
 * routes/users.js  — All Admin-only
 *
 * GET    /api/users              – list (paginated, filterable)
 * GET    /api/users/:id          – single user detail
 * PUT    /api/users/:id          – update profile / role
 * PATCH  /api/users/:id/status   – activate / deactivate
 * DELETE /api/users/:id          – hard delete
 */

const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  setUserStatus,
  deleteUser,
} = require('../controllers/userController');

const { verifyToken } = require('../middleware/auth');
const { isAdmin }     = require('../middleware/isAdmin');

// All routes require auth + admin role
router.use(verifyToken, isAdmin);

router.get(   '/',               getAllUsers);
router.get(   '/:id',            getUserById);
router.put(   '/:id',            updateUser);
router.patch( '/:id/status',     setUserStatus);
router.delete('/:id',            deleteUser);

module.exports = router;
