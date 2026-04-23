/**
 * models/index.js
 * Initialises Sequelize, loads all model files, and wires up associations.
 */

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const env       = process.env.NODE_ENV || 'development';
const dbConfig  = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig,
);

// ─── Load Models ─────────────────────────────────────────────────────────────
const User        = require('./User')(sequelize, DataTypes);
const Category    = require('./Category')(sequelize, DataTypes);
const Product     = require('./Product')(sequelize, DataTypes);
const Order       = require('./Order')(sequelize, DataTypes);
const OrderDetail = require('./OrderDetail')(sequelize, DataTypes);

// ─── Associations ─────────────────────────────────────────────────────────────

// Category  ──< Product
Category.hasMany(Product,  { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// User  ──< Order
User.hasMany(Order,   { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

// Order  ──< OrderDetail  >── Product   (junction / N:N)
Order.hasMany(OrderDetail,        { foreignKey: 'order_id',   as: 'orderDetails' });
OrderDetail.belongsTo(Order,      { foreignKey: 'order_id',   as: 'order' });

Product.hasMany(OrderDetail,      { foreignKey: 'product_id', as: 'orderDetails' });
OrderDetail.belongsTo(Product,    { foreignKey: 'product_id', as: 'product' });

// Convenience N:N accessors
Order.belongsToMany(Product,   { through: OrderDetail, foreignKey: 'order_id',   otherKey: 'product_id', as: 'products' });
Product.belongsToMany(Order,   { through: OrderDetail, foreignKey: 'product_id', otherKey: 'order_id',   as: 'orders' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Category,
  Product,
  Order,
  OrderDetail,
};
