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
<<<<<<< HEAD
      slug: {
        type:      DataTypes.STRING(100),
        allowNull: true,
        unique:    { name: 'uq_categories_slug', msg: 'A category with this slug already exists.' },
        validate: {
          is: {
            args: /^[a-z0-9-]*$/,
            msg:  'Slug must be lowercase alphanumeric with hyphens only.',
          },
        },
      },
=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
