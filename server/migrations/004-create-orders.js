/**
 * Migration 004 — Create `orders` table
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type:          Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
        allowNull:     false,
      },
      user_id: {
        type:       Sequelize.INTEGER.UNSIGNED,
        allowNull:  false,
        references: { model: 'users', key: 'id' },
        onUpdate:   'CASCADE',
        onDelete:   'RESTRICT',
      },
      status: {
        type:         Sequelize.ENUM('Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'),
        allowNull:    false,
        defaultValue: 'Pending',
      },
      subtotal: {
        type:      Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_cost: {
        type:         Sequelize.DECIMAL(10, 2),
        allowNull:    false,
        defaultValue: 0.00,
      },
      total: {
        type:      Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_address: {
        type:      Sequelize.JSON,
        allowNull: false,
      },
      notes: {
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

    await queryInterface.addIndex('orders', ['user_id'], { name: 'idx_orders_user' });
    await queryInterface.addIndex('orders', ['status'],  { name: 'idx_orders_status' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orders');
  },
};
