/**
 * models/Order.js
 *
 * Fields:
 *   id               – PK (auto-increment)
 *   user_id          – FK → users.id  (NULL allowed = guest order, per schema.sql)
 *   status           – ENUM lifecycle: Pending → Processing → Shipped → Completed | Cancelled
 *   subtotal         – DECIMAL(10,2) >= 0
 *   shipping_cost    – DECIMAL(10,2) >= 0, 0 when subtotal >= 75 (free shipping threshold)
 *   total            – DECIMAL(10,2) >= 0
 *   shipping_address – JSON: { street, city, state, zip, country }
 *   payment_method   – ENUM: card | paypal | applepay
 *   notes            – optional customer notes TEXT
 *
 * Note: user_id is nullable so orders created before user deletion are preserved.
 *       The DB FK is ON DELETE SET NULL (schema.sql). The model reflects this.
 *       The current API requires auth (verifyToken), so in practice user_id is always set;
 *       but the schema allows future guest checkout support.
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
        allowNull: true,                      // NULL = guest order / user deleted
        references: { model: 'users', key: 'id' },
        onUpdate:  'CASCADE',
        onDelete:  'SET NULL',                // preserve order history when user is deleted
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
        validate: { min: { args: [0], msg: 'Subtotal must be >= 0.' } },
      },
      shipping_cost: {
        type:         DataTypes.DECIMAL(10, 2),
        allowNull:    false,
        defaultValue: 0.00,
        validate: { min: { args: [0], msg: 'Shipping cost must be >= 0.' } },
      },
      total: {
        type:      DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: { args: [0], msg: 'Total must be >= 0.' } },
      },
      shipping_address: {
        type:      DataTypes.JSON,
        allowNull: false,
        comment:   '{ street, city, state, zip, country }',
      },
      payment_method: {
        type:         DataTypes.ENUM('card', 'paypal', 'applepay'),
        allowNull:    false,
        defaultValue: 'card',
        validate: {
          isIn: {
            args: [['card', 'paypal', 'applepay']],
            msg:  'payment_method must be card, paypal, or applepay.',
          },
        },
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
