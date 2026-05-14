/**
 * models/BrewingGuide.js
 *
 * Maps to the `brewing_guides` table defined in schema.sql.
 *
 * Fields:
 *   id               – PK (auto-increment)
 *   method           – e.g. 'Pour Over', 'Espresso'
 *   slug             – URL-safe unique key (e.g. 'pour-over')
 *   tagline          – Short marketing line
 *   description      – Long-form description
 *   difficulty       – ENUM('Beginner','Intermediate','Advanced')
 *   brew_time        – e.g. '4–5 min'
 *   water_temp       – e.g. '90–96 °C / 194–205 °F'
 *   grind_size       – e.g. 'Medium-Fine'
 *   grind_detail     – Detailed explanation of the grind setting
 *   ratio            – e.g. '1:15'
 *   brew_yield       – e.g. '300 ml'
 *   equipment        – JSON string array
 *   steps            – JSON array of { title, detail } objects
 *   pro_tips         – JSON string array
 *   best_with        – Recommended coffee style
 *   flavor_profile   – Expected flavor description
 *   recommended_roast – Suggested products / origins
 *   image_url        – Hero image URL
 *   featured         – Boolean, shown on homepage
 *   sort_order       – Display order in UI
 */

module.exports = (sequelize, DataTypes) => {
  const BrewingGuide = sequelize.define(
    'BrewingGuide',
    {
      id: {
        type:          DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey:    true,
      },
      method: {
        type:      DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Method name must not be empty.' },
        },
      },
      slug: {
        type:      DataTypes.STRING(100),
        allowNull: false,
        unique:    { name: 'uq_brewing_guides_slug', msg: 'A guide with this slug already exists.' },
        validate: {
          notEmpty: { msg: 'Slug must not be empty.' },
          is: {
            args: /^[a-z0-9-]+$/,
            msg:  'Slug must be lowercase alphanumeric with hyphens only.',
          },
        },
      },
      tagline: {
        type:      DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type:      DataTypes.TEXT,
        allowNull: true,
      },
      difficulty: {
        type:      DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['Beginner', 'Intermediate', 'Advanced']],
            msg:  'Difficulty must be Beginner, Intermediate, or Advanced.',
          },
        },
      },
      brew_time: {
        type:      DataTypes.STRING(50),
        allowNull: true,
      },
      water_temp: {
        type:      DataTypes.STRING(80),
        allowNull: true,
        comment:   'e.g. 90–96 °C / 194–205 °F',
      },
      grind_size: {
        type:      DataTypes.STRING(50),
        allowNull: true,
      },
      grind_detail: {
        type:      DataTypes.TEXT,
        allowNull: true,
      },
      ratio: {
        type:      DataTypes.STRING(30),
        allowNull: true,
        comment:   'e.g. 1:15',
      },
      brew_yield: {
        type:      DataTypes.STRING(50),
        allowNull: true,
        comment:   'e.g. 300 ml',
      },
      equipment: {
        type:      DataTypes.JSON,
        allowNull: true,
        comment:   'JSON string array',
      },
      steps: {
        type:      DataTypes.JSON,
        allowNull: true,
        comment:   'JSON array of { title, detail } objects',
      },
      pro_tips: {
        type:      DataTypes.JSON,
        allowNull: true,
        comment:   'JSON string array',
      },
      best_with: {
        type:      DataTypes.STRING(255),
        allowNull: true,
      },
      flavor_profile: {
        type:      DataTypes.STRING(255),
        allowNull: true,
      },
      recommended_roast: {
        type:      DataTypes.STRING(255),
        allowNull: true,
      },
      image_url: {
        type:      DataTypes.STRING(500),
        allowNull: true,
      },
      featured: {
        type:         DataTypes.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
      },
      sort_order: {
        type:         DataTypes.TINYINT,
        allowNull:    false,
        defaultValue: 0,
      },
    },
    {
      tableName:   'brewing_guides',
      timestamps:  true,
      underscored: true,
    },
  );

  return BrewingGuide;
};
