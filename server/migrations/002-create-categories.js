/**
 * Migration 002 — Create `categories` table
 *
 * Adds slug column (present in schema.sql and Category model, missing from original migration).
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        type:          Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
        allowNull:     false,
      },
      name: {
        type:      Sequelize.STRING(100),
        allowNull: false,
        unique:    true,
      },
      // ── slug is used for URL-based category filtering in the frontend ──
      slug: {
        type:      Sequelize.STRING(100),
        allowNull: true,
        unique:    true,
        comment:   'URL-safe identifier, e.g. whole-bean',
      },
      description: {
        type:      Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addIndex('categories', ['name'], { name: 'idx_categories_name' });
    await queryInterface.addIndex('categories', ['slug'], { name: 'idx_categories_slug' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('categories');
  },
};
