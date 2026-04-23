/**
 * Migration 001 — Create `users` table
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type:          Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
        allowNull:     false,
      },
      username: {
        type:      Sequelize.STRING(50),
        allowNull: false,
        unique:    true,
      },
      email: {
        type:      Sequelize.STRING(255),
        allowNull: false,
        unique:    true,
      },
      password: {
        type:      Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type:         Sequelize.ENUM('Admin', 'Customer'),
        allowNull:    false,
        defaultValue: 'Customer',
      },
      is_active: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: true,
      },
      created_at: {
        type:      Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type:      Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Indexes for fast lookup on login
    await queryInterface.addIndex('users', ['email'],    { name: 'idx_users_email' });
    await queryInterface.addIndex('users', ['username'], { name: 'idx_users_username' });
    await queryInterface.addIndex('users', ['role'],     { name: 'idx_users_role' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
