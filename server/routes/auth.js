/**
 * routes/auth.js
 *
 * POST /api/auth/register   – public  – create a new Customer account
 * POST /api/auth/login      – public  – authenticate and receive JWT
 * GET  /api/auth/me         – private – return own profile
 */

const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const { register, login, getMe } = require('../controllers/authController');
const { verifyToken }             = require('../middleware/auth');

// ─── Input validation middleware ──────────────────────────────────────────────

const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3–50 characters.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.'),
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

/** Middleware: check express-validator results and short-circuit on error. */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors:  errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Public
router.post('/register', validateRegister, checkValidation, register);
router.post('/login',    validateLogin,    checkValidation, login);

// Protected
router.get('/me', verifyToken, getMe);

module.exports = router;
