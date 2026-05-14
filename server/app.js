/**
 * app.js — Express application entry point
 * Fondo — Backend API (Production-Ready)
 *
 * Security hardening applied:
 *   • helmet    — sets secure HTTP response headers
 *   • express-rate-limit — brute-force protection on auth routes
 *   • CORS with explicit origin allowlist
 *   • JSON body size capped at 1 mb to prevent payload flooding
 *   • Graceful shutdown on SIGTERM / SIGINT
 */

require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const { sequelize } = require('./models');
const routes        = require('./routes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, cb) => {
    // Allow curl / server-to-server (no origin) + explicitly listed origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS policy: ${origin} not allowed.`));
  },
  credentials: true,
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Strict limit on auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15 minutes
  max:             20,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { success: false, message: 'Too many requests — please try again in 15 minutes.' },
});

// General API rate limit
const apiLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             300,
  standardHeaders: true,
  legacyHeaders:   false,
});

app.use('/api/auth', authLimiter);
app.use('/api',      apiLimiter);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({
  status:    'ok',
  timestamp: new Date().toISOString(),
  env:       process.env.NODE_ENV,
  uptime:    process.uptime(),
}));

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const isDev        = process.env.NODE_ENV !== 'production';
  const statusCode   = err.statusCode || 500;
  console.error('[ERROR]', err.message, isDev ? err.stack : '');
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
});

// ─── Database Connection & Server Start ──────────────────────────────────────
let server;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  Database connection established.');

    // In development, use Sequelize sync with alter for convenience.
    // In production, use migrations only (npm run db:migrate).
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅  Models synchronised (alter mode — development only).');
    }

    server = app.listen(PORT, () => {
      console.log(`🚀  Fondo API → http://localhost:${PORT}`);
      console.log(`📋  Health check        → http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌  Unable to start server:', err.message);
    process.exit(1);
  }
})();

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\n${signal} received — gracefully shutting down…`);
  if (server) server.close(() => console.log('✅  HTTP server closed.'));
  await sequelize.close();
  console.log('✅  Database connection closed.');
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
