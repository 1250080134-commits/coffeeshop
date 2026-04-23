/**
 * controllers/userController.js  (Admin-only)
 *
 * GET    /api/users        – list all users (paginated)
 * GET    /api/users/:id    – single user detail
 * PUT    /api/users/:id    – update username / email / role
 * PATCH  /api/users/:id/status – activate / deactivate
 * DELETE /api/users/:id    – hard delete
 */

const { User, Order } = require('../models');
const { Op }          = require('sequelize');

// ─── List All Users ───────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page  || '1',  10));
    const limit  = Math.min(100, parseInt(req.query.limit || '20', 10));
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.role)   where.role      = req.query.role;
    if (req.query.active) where.is_active = req.query.active === 'true';
    if (req.query.search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${req.query.search}%` } },
        { email:    { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      order:    [['created_at', 'DESC']],
      limit,
      offset,
      attributes: { exclude: ['password'] },
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      data:    users,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[userController.getAllUsers]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get Single User ──────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include:    [{ model: Order, as: 'orders', attributes: ['id', 'status', 'total', 'created_at'] }],
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('[userController.getUserById]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Update User ──────────────────────────────────────────────────────────────
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const { username, email, role } = req.body;

    // Check uniqueness if changing username or email
    if (username || email) {
      const conflict = await User.findOne({
        where: {
          id: { [Op.ne]: user.id },
          [Op.or]: [
            ...(username ? [{ username }] : []),
            ...(email    ? [{ email }]    : []),
          ],
        },
      });
      if (conflict) {
        return res.status(409).json({ success: false, message: 'Username or email already in use.' });
      }
    }

    await user.update({
      ...(username !== undefined && { username }),
      ...(email    !== undefined && { email: email.toLowerCase().trim() }),
      ...(role     !== undefined && { role }),
    });

    return res.status(200).json({ success: true, message: 'User updated.', data: user.toJSON() });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        errors:  err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    console.error('[userController.updateUser]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Toggle Active Status ─────────────────────────────────────────────────────
const setUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const { is_active } = req.body;
    if (typeof is_active !== 'boolean') {
      return res.status(422).json({ success: false, message: 'is_active must be a boolean.' });
    }

    // Prevent admin from deactivating themselves
    if (user.id === req.user.id && !is_active) {
      return res.status(409).json({ success: false, message: 'You cannot deactivate your own account.' });
    }

    await user.update({ is_active });

    return res.status(200).json({
      success: true,
      message: `User ${is_active ? 'activated' : 'deactivated'}.`,
      data:    user.toJSON(),
    });
  } catch (err) {
    console.error('[userController.setUserStatus]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Delete User ──────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    if (parseInt(req.params.id, 10) === req.user.id) {
      return res.status(409).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    await user.destroy();
    return res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (err) {
    console.error('[userController.deleteUser]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, setUserStatus, deleteUser };
