/**
 * app.js — Express application entry point
 * The Artisan Bean Hub — Backend API
 */

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const { sequelize } = require('./models');
const routes     = require('./routes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Database Sync & Server Start ────────────────────────────────────────────
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  Database connection established.');

    // Use migrations in production; sync({ alter: true }) in dev for convenience
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅  Models synchronised (alter mode).');
    }

    app.listen(PORT, () => {
      console.log(`🚀  Artisan Bean Hub API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌  Unable to connect to the database:', err);
    process.exit(1);
  }
})();
