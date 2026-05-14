/**
 * models/User.js
 *
 * Fields:
 *   id          – PK (auto-increment integer)
 *   username    – unique, not-null
 *   email       – unique, not-null, validated as email
 *   password    – bcrypt-hashed string, not-null
 *   role        – ENUM('Admin', 'Customer'), default 'Customer'
 *   is_active   – soft-delete / deactivation flag
 *
 * Business rules enforced:
 *   • username and email must be unique (DB-level UNIQUE constraint + Sequelize validate).
 *   • password is NEVER returned in JSON (toJSON override).
 */

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type:          DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
      },
      username: {
        type:      DataTypes.STRING(50),
        allowNull: false,
        unique:    { name: 'uq_users_username', msg: 'Username is already taken.' },
        validate: {
          notEmpty: { msg: 'Username must not be empty.' },
          len:      { args: [3, 50], msg: 'Username must be 3–50 characters.' },
        },
      },
      email: {
        type:      DataTypes.STRING(255),
        allowNull: false,
        unique:    { name: 'uq_users_email', msg: 'Email is already registered.' },
        validate: {
          isEmail:  { msg: 'Must be a valid email address.' },
          notEmpty: { msg: 'Email must not be empty.' },
        },
      },
      password: {
        type:      DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Password must not be empty.' },
        },
      },
      role: {
        type:         DataTypes.ENUM('Admin', 'Customer'),
        allowNull:    false,
        defaultValue: 'Customer',
        validate: {
          isIn: {
            args:  [['Admin', 'Customer']],
            msg:   'Role must be Admin or Customer.',
          },
        },
      },
      is_active: {
        type:         DataTypes.BOOLEAN,
        allowNull:    false,
        defaultValue: true,
      },
    },
    {
      tableName:  'users',
      timestamps: true,         // createdAt, updatedAt
      underscored: true,        // snake_case column names
      hooks: {
        /** Hash the password before every create / update that touches it. */
        beforeSave: async (user) => {
          if (user.changed('password')) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
        },
      },
    },
  );

  /**
   * Instance method — compare a plain-text candidate against the stored hash.
   * Usage: const isValid = await user.comparePassword(plainText);
   */
  User.prototype.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  /**
   * Override toJSON so the hashed password is never serialised.
   */
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  return User;
};
