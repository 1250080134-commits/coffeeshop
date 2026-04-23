/**
 * config/database.js
 * Sequelize connection configuration for development, test, and production.
 * Uses environment variables — copy .env.example → .env and fill in your values.
 */

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME     || 'artisan_bean_hub',
    host:     process.env.DB_HOST     || '127.0.0.1',
    port:     parseInt(process.env.DB_PORT || '3306', 10),
    dialect:  'mysql',
    logging:  (sql) => console.log(`[SQL] ${sql}`),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle:    10000,
    },
  },

  test: {
    username: process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || null,
    database: `${process.env.DB_NAME || 'artisan_bean_hub'}_test`,
    host:     process.env.DB_HOST     || '127.0.0.1',
    port:     parseInt(process.env.DB_PORT || '3306', 10),
    dialect:  'mysql',
    logging:  false,
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT || '3306', 10),
    dialect:  'mysql',
    logging:  false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle:    10000,
    },
    dialectOptions: {
      ssl: {
        require:            true,
        rejectUnauthorized: false,
      },
    },
  },
};
