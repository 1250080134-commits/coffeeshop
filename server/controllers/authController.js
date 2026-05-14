/**
 * controllers/authController.js
 *
 * register  — Creates a new Customer account after validating uniqueness.
 * login     — Verifies credentials and issues a signed JWT.
 * getMe     — Returns the currently authenticated user's profile.
 */

const jwt  = require('jsonwebtoken');
const { User } = require('../models');
const { Op }   = require('sequelize');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Sign a JWT containing the user's id, username, and role.
 * @param {object} user  – Sequelize User instance
 * @returns {string}     – signed JWT string
 */
const signToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
};

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { username, email, password, [role] }
 *
 * Business rules:
 *   • email    must be unique
 *   • username must be unique
 *   • password is hashed by the User model's beforeSave hook
 *   • role is forced to 'Customer' unless the caller is authenticated as Admin
 *     (admins can create other admins via a separate route if needed)
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ── 1. Check for existing email or username in one query ──────────────
    const existing = await User.findOne({
      where: {
        [Op.or]: [
          { email:    email.toLowerCase().trim() },
          { username: username.trim() },
        ],
      },
      attributes: ['id', 'email', 'username'],
    });

    if (existing) {
      const field = existing.email === email.toLowerCase().trim() ? 'email' : 'username';
      return res.status(409).json({
        success: false,
        message: `An account with this ${field} already exists.`,
        field,
      });
    }

    // ── 2. Create the user (password hashed via model hook) ───────────────
    const user = await User.create({
      username: username.trim(),
      email:    email.toLowerCase().trim(),
      password,                // plain text — beforeSave hook hashes it
      role:     'Customer',    // always Customer on self-registration
    });

    // ── 3. Issue JWT ──────────────────────────────────────────────────────
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: user.toJSON(),   // password field removed by toJSON override
    });
  } catch (err) {
    // Handle Sequelize validation errors gracefully
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors:  err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Username or email is already taken.',
      });
    }
    console.error('[authController.register]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Returns a JWT on success.
 * Uses a single generic error message to prevent user enumeration.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── 1. Find user by email (include password for comparison) ──────────
    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() },
      // Override the toJSON-based exclusion — we need the hash to compare
      attributes: { include: ['password'] },
    });

    // Generic message to prevent user enumeration
    const INVALID_MSG = 'Invalid email or password.';

    if (!user) {
      return res.status(401).json({ success: false, message: INVALID_MSG });
    }

    // ── 2. Check account status ───────────────────────────────────────────
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    // ── 3. Compare passwords ──────────────────────────────────────────────
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: INVALID_MSG });
    }

    // ── 4. Sign and return token ──────────────────────────────────────────
    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('[authController.login]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────

/**
 * GET /api/auth/me  (protected)
 * Returns the authenticated user's profile (no password).
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, user: user.toJSON() });
  } catch (err) {
    console.error('[authController.getMe]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { register, login, getMe };
