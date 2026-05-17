/**
 * Migration 004 — Create `orders` table
<<<<<<< HEAD
 *
 * Fixes applied vs original:
 *   1. payment_method column added (was missing — present in schema.sql and model)
 *   2. user_id allowNull changed to NULL (was NOT NULL — contradicts Order model + schema.sql
 *      which both say "NULL = guest order / user deleted")
 *   3. user_id onDelete changed to SET NULL (was RESTRICT — contradicts model + schema.sql;
 *      RESTRICT would prevent deleting users who have orders)
=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
        allowNull:  true,                    // NULL = guest order / user was deleted
        references: { model: 'users', key: 'id' },
        onUpdate:   'CASCADE',
        onDelete:   'SET NULL',              // preserve order history when user is deleted
=======
        allowNull:  false,
        references: { model: 'users', key: 'id' },
        onUpdate:   'CASCADE',
        onDelete:   'RESTRICT',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
      payment_method: {
        type:         Sequelize.ENUM('card', 'paypal', 'applepay'),
        allowNull:    false,
        defaultValue: 'card',
      },
=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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

<<<<<<< HEAD
    await queryInterface.addIndex('orders', ['user_id'],    { name: 'idx_orders_user' });
    await queryInterface.addIndex('orders', ['status'],     { name: 'idx_orders_status' });
    await queryInterface.addIndex('orders', ['created_at'], { name: 'idx_orders_created' });
=======
    await queryInterface.addIndex('orders', ['user_id'], { name: 'idx_orders_user' });
    await queryInterface.addIndex('orders', ['status'],  { name: 'idx_orders_status' });
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orders');
  },
};
