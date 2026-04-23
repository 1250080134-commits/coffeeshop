/**
 * models/Category.js
 *
 * Fields:
 *   id          – PK (auto-increment)
 *   name        – unique, not-null
 *   description – optional long-text
 */

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: {
        type:          DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
      },
      name: {
        type:      DataTypes.STRING(100),
        allowNull: false,
        unique:    { name: 'uq_categories_name', msg: 'Category name already exists.' },
        validate: {
          notEmpty: { msg: 'Category name must not be empty.' },
          len:      { args: [2, 100], msg: 'Name must be 2–100 characters.' },
        },
      },
      description: {
        type:      DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName:   'categories',
      timestamps:  true,
      underscored: true,
    },
  );

  return Category;
};
