/**
 * Migration 006 — Create `brewing_guides` table
 *
 * This table is defined in schema.sql and has a full Sequelize model (BrewingGuide.js)
 * but was MISSING from the migrations directory. This migration creates it.
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('brewing_guides', {
      id: {
        type:          Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
        allowNull:     false,
      },
      method: {
        type:      Sequelize.STRING(100),
        allowNull: false,
        comment:   'e.g. Pour Over, Espresso',
      },
      slug: {
        type:      Sequelize.STRING(100),
        allowNull: false,
        unique:    { name: 'uq_brewing_guides_slug' },
        comment:   'URL key, e.g. pour-over',
      },
      tagline: {
        type:      Sequelize.STRING(255),
        allowNull: true,
      },
      description: {
        type:      Sequelize.TEXT,
        allowNull: true,
      },
      difficulty: {
        type:      Sequelize.ENUM('Beginner', 'Intermediate', 'Advanced'),
        allowNull: false,
      },
      brew_time: {
        type:      Sequelize.STRING(50),
        allowNull: true,
      },
      water_temp: {
        type:      Sequelize.STRING(80),
        allowNull: true,
        comment:   'e.g. 90–96 °C / 194–205 °F',
      },
      grind_size: {
        type:      Sequelize.STRING(50),
        allowNull: true,
      },
      grind_detail: {
        type:      Sequelize.TEXT,
        allowNull: true,
      },
      ratio: {
        type:      Sequelize.STRING(30),
        allowNull: true,
        comment:   'e.g. 1:15',
      },
      brew_yield: {
        type:      Sequelize.STRING(50),
        allowNull: true,
        comment:   'e.g. 300 ml',
      },
      equipment: {
        type:      Sequelize.JSON,
        allowNull: true,
        comment:   'JSON string array',
      },
      steps: {
        type:      Sequelize.JSON,
        allowNull: true,
        comment:   'JSON array of { title, detail } objects',
      },
      pro_tips: {
        type:      Sequelize.JSON,
        allowNull: true,
        comment:   'JSON string array',
      },
      best_with: {
        type:      Sequelize.STRING(255),
        allowNull: true,
      },
      flavor_profile: {
        type:      Sequelize.STRING(255),
        allowNull: true,
      },
      recommended_roast: {
        type:      Sequelize.STRING(255),
        allowNull: true,
      },
      image_url: {
        type:      Sequelize.STRING(500),
        allowNull: true,
      },
      featured: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
      },
      sort_order: {
        type:         Sequelize.TINYINT,
        allowNull:    false,
        defaultValue: 0,
        comment:      'Display order in UI',
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

    await queryInterface.addIndex('brewing_guides', ['difficulty'], { name: 'idx_brewing_guides_difficulty' });
    await queryInterface.addIndex('brewing_guides', ['featured'],   { name: 'idx_brewing_guides_featured' });
    await queryInterface.addIndex('brewing_guides', ['sort_order'], { name: 'idx_brewing_guides_sort' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('brewing_guides');
  },
};
