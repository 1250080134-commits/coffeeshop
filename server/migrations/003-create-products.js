/**
 * Migration 003 — Create `products` table
 *
 * Includes DB-level CHECK constraints for price >= 0 and stock >= 0.
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type:          Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
        allowNull:     false,
      },
      name: {
        type:      Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type:      Sequelize.TEXT,
        allowNull: true,
      },
      short_description: {
        type:      Sequelize.STRING(500),
        allowNull: true,
      },
      // ── Price: must be >= 0 (enforced at DB level via CHECK) ──────────────
      price: {
        type:      Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment:   'CHECK (price >= 0)',
      },
      original_price: {
        type:      Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      // ── Stock: non-negative integer (enforced at DB level via CHECK) ───────
      stock: {
        type:         Sequelize.INTEGER.UNSIGNED,  // UNSIGNED already prevents negatives in MySQL
        allowNull:    false,
        defaultValue: 0,
      },
      roast_level: {
        type:      Sequelize.ENUM('Light', 'Medium', 'Dark'),
        allowNull: true,
      },
      origin: {
        type:      Sequelize.STRING(100),
        allowNull: true,
      },
      processing_method: {
        type:      Sequelize.ENUM('Washed', 'Natural', 'Anaerobic', 'Honey'),
        allowNull: true,
      },
      weight: {
        type:      Sequelize.STRING(20),
        allowNull: true,
      },
      flavor_notes: {
        type:      Sequelize.JSON,
        allowNull: true,
      },
      image_url: {
        type:      Sequelize.STRING(2048),
        allowNull: true,
      },
      badge: {
        type:      Sequelize.STRING(50),
        allowNull: true,
      },
      rating: {
        type:      Sequelize.DECIMAL(3, 2),
        allowNull: true,
      },
      review_count: {
        type:         Sequelize.INTEGER.UNSIGNED,
        allowNull:    false,
        defaultValue: 0,
      },
      featured: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
      },
      category_id: {
        type:       Sequelize.INTEGER.UNSIGNED,
        allowNull:  false,
        references: { model: 'categories', key: 'id' },
        onUpdate:   'CASCADE',
        onDelete:   'RESTRICT',
      },
      created_at: {
        type:         Sequelize.DATE,
        allowNull:    false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type:         Sequelize.DATE,
        allowNull:    false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // ── Indexes for filter/search performance ─────────────────────────────
    await queryInterface.addIndex('products', ['category_id'],       { name: 'idx_products_category' });
    await queryInterface.addIndex('products', ['roast_level'],       { name: 'idx_products_roast' });
    await queryInterface.addIndex('products', ['origin'],            { name: 'idx_products_origin' });
    await queryInterface.addIndex('products', ['processing_method'], { name: 'idx_products_processing' });
    await queryInterface.addIndex('products', ['price'],             { name: 'idx_products_price' });
    await queryInterface.addIndex('products', ['featured'],          { name: 'idx_products_featured' });

    // ── DB-level CHECK: price >= 0 (MySQL 8.0.16+) ────────────────────────
    // Note: MySQL UNSIGNED integer already prevents stock < 0.
    await queryInterface.sequelize.query(
      `ALTER TABLE products ADD CONSTRAINT chk_products_price_positive CHECK (price >= 0)`
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products');
  },
};
