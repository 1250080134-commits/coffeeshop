/**
 * Migration 005 — Create `order_details` table (Order ↔ Product junction)
<<<<<<< HEAD
 *
 * Adds grind_size and selected_weight columns to match the OrderDetail model and schema.sql.
=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_details', {
      id: {
        type:          Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
        allowNull:     false,
      },
      order_id: {
        type:       Sequelize.INTEGER.UNSIGNED,
        allowNull:  false,
        references: { model: 'orders',   key: 'id' },
        onUpdate:   'CASCADE',
        onDelete:   'CASCADE',
      },
      product_id: {
        type:       Sequelize.INTEGER.UNSIGNED,
        allowNull:  false,
        references: { model: 'products', key: 'id' },
        onUpdate:   'CASCADE',
        onDelete:   'RESTRICT',
      },
      quantity: {
        type:      Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      unit_price: {
        type:      Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment:   'Price snapshotted at order time',
      },
<<<<<<< HEAD
      // ── grind_size and selected_weight are captured at checkout ──
      grind_size: {
        type:      Sequelize.STRING(50),
        allowNull: true,
        comment:   'Grind option chosen at checkout, e.g. Pour Over, Espresso',
      },
      selected_weight: {
        type:      Sequelize.STRING(20),
        allowNull: true,
        comment:   'Weight option chosen at checkout, e.g. 250g, 500g, 1kg',
      },
=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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

    // Enforce one row per (order, product) pair
    await queryInterface.addIndex('order_details', ['order_id', 'product_id'], {
      unique: true,
      name:   'uq_order_product',
    });

<<<<<<< HEAD
    await queryInterface.addIndex('order_details', ['order_id'],   { name: 'idx_order_details_order' });
=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
    await queryInterface.addIndex('order_details', ['product_id'], { name: 'idx_order_details_product' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('order_details');
  },
};
