/**
 * models/Order.js
 *
 * Fields:
 *   id               – PK (auto-increment)
 *   user_id          – FK → users.id
 *   status           – ENUM lifecycle
 *   subtotal         – DECIMAL(10,2)
 *   shipping_cost    – DECIMAL(10,2)
 *   total            – DECIMAL(10,2)
 *   shipping_address – JSON object { street, city, state, zip, country }
 *   notes            – optional customer notes
 */

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type:          DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
      },
      user_id: {
        type:      DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate:  'CASCADE',
        onDelete:  'RESTRICT',
      },
      status: {
        type:         DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'),
        allowNull:    false,
        defaultValue: 'Pending',
        validate: {
          isIn: {
            args: [['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']],
            msg:  'Invalid order status.',
          },
        },
      },
      subtotal: {
        type:      DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: { args: [0], msg: 'Subtotal must be >= 0.' },
        },
      },
      shipping_cost: {
        type:         DataTypes.DECIMAL(10, 2),
        allowNull:    false,
        defaultValue: 0.00,
        validate: {
          min: { args: [0], msg: 'Shipping cost must be >= 0.' },
        },
      },
      total: {
        type:      DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: { args: [0], msg: 'Total must be >= 0.' },
        },
      },
      shipping_address: {
        type:      DataTypes.JSON,
        allowNull: false,
        comment:   '{ street, city, state, zip, country }',
      },
      notes: {
        type:      DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName:   'orders',
      timestamps:  true,
      underscored: true,
    },
  );

  return Order;
};
