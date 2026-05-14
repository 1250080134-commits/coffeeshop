/**
 * models/Product.js
 *
 * Fields:
 *   id                 – PK (auto-increment)
 *   name               – not-null, 2-200 chars
 *   description        – optional TEXT
 *   price              – DECIMAL(10,2), >= 0 (enforced via validate + DB CHECK)
 *   stock              – INTEGER, >= 0 (enforced via validate + DB CHECK)
 *   roast_level        – ENUM('Light','Medium','Dark') | nullable
 *   origin             – VARCHAR(100) | nullable  (e.g. 'Ethiopia')
 *   processing_method  – ENUM('Washed','Natural','Anaerobic','Honey') | nullable
 *   image_url          – optional URL
 *   category_id        – FK → categories.id
 *
 * Business rules:
 *   • price  >= 0 (Sequelize validate + DB-level CHECK constraint in migration)
 *   • stock  >= 0 (Sequelize validate + DB-level CHECK constraint in migration)
 */

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type:          DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
      },
      name: {
        type:      DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Product name must not be empty.' },
          len:      { args: [2, 200], msg: 'Product name must be 2–200 characters.' },
        },
      },
      description: {
        type:      DataTypes.TEXT,
        allowNull: true,
      },
      short_description: {
        type:      DataTypes.STRING(500),
        allowNull: true,
      },
      price: {
        type:      DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: { msg: 'Price must be a valid decimal number.' },
          min: {
            args: [0],
            msg:  'Price must be greater than or equal to 0.',
          },
        },
      },
      original_price: {
        type:      DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: {
            args: [0],
            msg:  'Original price must be >= 0.',
          },
        },
      },
      stock: {
        type:         DataTypes.INTEGER.UNSIGNED,
        allowNull:    false,
        defaultValue: 0,
        validate: {
          isInt: { msg: 'Stock must be an integer.' },
          min: {
            args: [0],
            msg:  'Stock cannot be negative.',
          },
        },
      },
      roast_level: {
        type:      DataTypes.ENUM('Light', 'Medium', 'Dark'),
        allowNull: true,
      },
      origin: {
        type:      DataTypes.STRING(100),
        allowNull: true,
      },
      processing_method: {
        type:      DataTypes.ENUM('Washed', 'Natural', 'Anaerobic', 'Honey'),
        allowNull: true,
      },
      weight: {
        type:      DataTypes.STRING(20),
        allowNull: true,   // e.g. '250g', '1kg'
      },
      flavor_notes: {
        type:      DataTypes.JSON,
        allowNull: true,   // Stored as JSON array: ["Jasmine", "Peach"]
      },
      image_url: {
        type:      DataTypes.STRING(2048),
        allowNull: true,
        validate: {
          isUrl: { msg: 'image_url must be a valid URL.' },
        },
      },
      badge: {
        type:      DataTypes.STRING(50),
        allowNull: true,   // e.g. 'Bestseller', 'Limited', 'New'
      },
      rating: {
        type:         DataTypes.DECIMAL(3, 2),
        allowNull:    true,
        defaultValue: null,
        validate: {
          min: { args: [0],   msg: 'Rating must be >= 0.' },
          max: { args: [5],   msg: 'Rating must be <= 5.' },
        },
      },
      review_count: {
        type:         DataTypes.INTEGER.UNSIGNED,
        allowNull:    false,
        defaultValue: 0,
      },
      featured: {
        type:         DataTypes.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
      },
      category_id: {
        type:      DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    },
    {
      tableName:   'products',
      timestamps:  true,
      underscored: true,
    },
  );

  return Product;
};
