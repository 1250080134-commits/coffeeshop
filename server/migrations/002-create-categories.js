/**
 * Migration 002 — Create `categories` table
<<<<<<< HEAD
 *
 * Adds slug column (present in schema.sql and Category model, missing from original migration).
=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
      // ── slug is used for URL-based category filtering in the frontend ──
      slug: {
        type:      Sequelize.STRING(100),
        allowNull: true,
        unique:    true,
        comment:   'URL-safe identifier, e.g. whole-bean',
      },
=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
    await queryInterface.addIndex('categories', ['slug'], { name: 'idx_categories_slug' });
=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
  },

  async down(queryInterface) {
    await queryInterface.dropTable('categories');
  },
};
