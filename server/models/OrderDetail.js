/**
 * models/OrderDetail.js  — junction table for the Order ↔ Product N:N relationship
 *
 * Fields:
 *   id           – PK
 *   order_id     – FK → orders.id
 *   product_id   – FK → products.id
 *   quantity     – positive integer
 *   unit_price   – price captured at time of order (snapshot)
 *
 * The composite (order_id, product_id) pair is unique to prevent duplicate rows.
 */

module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    'OrderDetail',
    {
      id: {
        type:          DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
      },
      order_id: {
        type:      DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders',   key: 'id' },
        onUpdate:  'CASCADE',
        onDelete:  'CASCADE',      // if an order is deleted, its details go with it
      },
      product_id: {
        type:      DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate:  'CASCADE',
        onDelete:  'RESTRICT',     // prevent deleting a product that appears in an order
      },
      quantity: {
        type:      DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          min: { args: [1], msg: 'Quantity must be at least 1.' },
          isInt: { msg: 'Quantity must be an integer.' },
        },
      },
      unit_price: {
        type:      DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment:   'Price per unit snapshotted at the moment the order was placed.',
        validate: {
          min: { args: [0], msg: 'Unit price must be >= 0.' },
        },
      },
    },
    {
      tableName:   'order_details',
      timestamps:  true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['order_id', 'product_id'],
          name:   'uq_order_product',
        },
      ],
    },
  );

  return OrderDetail;
};
