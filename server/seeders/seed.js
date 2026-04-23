/**
 * seeders/seed.js
 *
 * Populates the database with the Artisan Bean Hub initial dataset.
 * Run with: node seeders/seed.js
 *
 * Idempotent — skips any record that already exists.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { sequelize, User, Category, Product } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  Connected to database.');

    // ── Categories ────────────────────────────────────────────────────────
    const [wholeBeanCat]  = await Category.findOrCreate({ where: { name: 'Whole Bean' },    defaults: { description: 'Fresh whole beans for the ultimate grind experience' } });
    const [groundCat]     = await Category.findOrCreate({ where: { name: 'Ground Coffee' }, defaults: { description: 'Pre-ground for convenience without compromise' } });
    const [accessoryCat]  = await Category.findOrCreate({ where: { name: 'Accessories' },   defaults: { description: 'Premium brewing tools and equipment' } });

    console.log('✅  Categories seeded.');

    // ── Admin User ────────────────────────────────────────────────────────
    await User.findOrCreate({
      where: { email: 'admin@artisanbean.com' },
      defaults: {
        username: 'alexroaster',
        password: 'Admin@12345',   // hashed by beforeSave hook
        role:     'Admin',
      },
    });

    await User.findOrCreate({
      where: { email: 'maria@artisanbean.com' },
      defaults: {
        username: 'mariabarista',
        password: 'Admin@12345',
        role:     'Admin',
      },
    });

    console.log('✅  Admin users seeded.');

    // ── Products ──────────────────────────────────────────────────────────
    const productData = [
      {
        name: 'Ethiopia Yirgacheffe',
        category_id: wholeBeanCat.id,
        price: 22.00, stock: 48, roast_level: 'Light',
        origin: 'Ethiopia', processing_method: 'Washed',
        description: 'Grown at high altitudes in the birthplace of coffee, this Yirgacheffe delivers an exceptionally clean cup with bright acidity.',
        short_description: 'Bright, floral, and clean with jasmine and bergamot.',
        weight: '250g', flavor_notes: ['Jasmine', 'Bergamot', 'Peach', 'Lemon Zest'],
        rating: 4.9, review_count: 128, featured: true, badge: 'Bestseller',
        image_url: 'https://images.unsplash.com/photo-1680338703568-fc868bef34da?w=800',
      },
      {
        name: 'Colombia Huila',
        category_id: wholeBeanCat.id,
        price: 19.50, original_price: 24.00, stock: 62, roast_level: 'Medium',
        origin: 'Colombia', processing_method: 'Washed',
        description: 'Sourced from family farms in the Huila department, nestled in the Andes mountains.',
        short_description: 'Caramel sweetness balanced with a bright, clean finish.',
        weight: '250g', flavor_notes: ['Caramel', 'Red Apple', 'Hazelnut', 'Brown Sugar'],
        rating: 4.7, review_count: 95, featured: true, badge: 'Sale',
        image_url: 'https://images.unsplash.com/photo-1765533220772-b83d18341db8?w=800',
      },
      {
        name: 'Guatemala Antigua',
        category_id: wholeBeanCat.id,
        price: 18.00, stock: 35, roast_level: 'Dark',
        origin: 'Guatemala', processing_method: 'Natural',
        description: 'From the volcanic soils of Antigua, this dark roast carries the rich, smoky character that espresso lovers crave.',
        short_description: 'Full-bodied, bold espresso with deep chocolate notes.',
        weight: '250g', flavor_notes: ['Dark Chocolate', 'Walnut', 'Tobacco', 'Molasses'],
        rating: 4.6, review_count: 77, featured: true,
        image_url: 'https://images.unsplash.com/photo-1646325742177-21f298f470c6?w=800',
      },
      {
        name: 'Kenya AA',
        category_id: wholeBeanCat.id,
        price: 26.00, stock: 24, roast_level: 'Light',
        origin: 'Kenya', processing_method: 'Washed',
        description: 'Kenya AA represents the country\'s highest grade, with beans selected for size, density, and cup quality.',
        short_description: 'Vibrant wine-like acidity with blackcurrant and citrus.',
        weight: '250g', flavor_notes: ['Blackcurrant', 'Grapefruit', 'Tomato', 'Black Tea'],
        rating: 4.8, review_count: 64, featured: false, badge: 'Limited',
        image_url: 'https://images.unsplash.com/photo-1633275858168-d53d224b2a8c?w=800',
      },
      {
        name: 'Costa Rica Tarrazu',
        category_id: wholeBeanCat.id,
        price: 24.50, stock: 41, roast_level: 'Medium',
        origin: 'Costa Rica', processing_method: 'Anaerobic',
        description: 'This experimental lot undergoes anaerobic fermentation before drying, pushing flavor boundaries.',
        short_description: 'Experimental anaerobic with tropical fruit and wine notes.',
        weight: '250g', flavor_notes: ['Mango', 'Passionfruit', 'Red Wine', 'Honey'],
        rating: 4.7, review_count: 43, featured: false, badge: 'New',
        image_url: 'https://images.unsplash.com/photo-1559648617-374af4ae6c2b?w=800',
      },
      {
        name: 'Panama Geisha',
        category_id: wholeBeanCat.id,
        price: 48.00, stock: 12, roast_level: 'Light',
        origin: 'Panama', processing_method: 'Washed',
        description: 'The legendary Geisha variety from Panama — the most celebrated coffee in the world.',
        short_description: 'The world\'s most celebrated variety — floral, tea-like, extraordinary.',
        weight: '100g', flavor_notes: ['Jasmine Tea', 'Stone Fruit', 'Elderflower', 'Honey'],
        rating: 5.0, review_count: 31, featured: false, badge: 'Rare',
        image_url: 'https://images.unsplash.com/photo-1672851612794-6687bf0bf1a3?w=800',
      },
      {
        name: 'Brazil Santos Ground',
        category_id: groundCat.id,
        price: 15.00, stock: 89, roast_level: 'Medium',
        origin: 'Brazil', processing_method: 'Natural',
        description: 'Brazil Santos is the quintessential everyday espresso base — naturally processed for a fuller body.',
        short_description: 'Classic smooth espresso base, naturally processed.',
        weight: '250g', flavor_notes: ['Chocolate', 'Almond', 'Caramel', 'Cream'],
        rating: 4.5, review_count: 112, featured: true,
        image_url: 'https://images.unsplash.com/photo-1769266018588-3aaff4f2ec06?w=800',
      },
      {
        name: 'Sumatra Mandheling Ground',
        category_id: groundCat.id,
        price: 16.50, stock: 57, roast_level: 'Dark',
        origin: 'Indonesia', processing_method: 'Natural',
        description: 'Processed using Indonesia\'s unique wet-hulled method, this Mandheling ground coffee is unlike anything else.',
        short_description: 'Earthy, bold, and intensely full-bodied.',
        weight: '250g', flavor_notes: ['Cedar', 'Dark Chocolate', 'Dried Herbs', 'Tobacco'],
        rating: 4.4, review_count: 68, featured: false,
        image_url: 'https://images.unsplash.com/photo-1585594467309-b726b6ba2fb5?w=800',
      },
      {
        name: 'Peru Organic Ground',
        category_id: groundCat.id,
        price: 17.00, stock: 44, roast_level: 'Medium',
        origin: 'Peru', processing_method: 'Washed',
        description: 'Certified organic and shade-grown by indigenous cooperatives in the Cajamarca highlands.',
        short_description: 'Clean, gentle, and sustainable — ideal for filter brewing.',
        weight: '250g', flavor_notes: ['Milk Chocolate', 'Walnut', 'Sweet Citrus', 'Honey'],
        rating: 4.6, review_count: 55, featured: false, badge: 'Organic',
        image_url: 'https://images.unsplash.com/photo-1775451152836-e68a116b48c4?w=800',
      },
      {
        name: 'Hario V60 Pour Over Kit',
        category_id: accessoryCat.id,
        price: 45.00, stock: 18,
        description: 'The iconic Hario V60 ceramic dripper bundled with a server, 100 filters, and a measuring spoon.',
        short_description: 'Complete V60 pour-over starter kit for the discerning brewer.',
        rating: 4.9, review_count: 89, featured: true, badge: 'Top Pick',
        image_url: 'https://images.unsplash.com/photo-1764807504818-a704510e2a21?w=800',
      },
      {
        name: 'Fellow Stagg EKG Kettle',
        category_id: accessoryCat.id,
        price: 165.00, stock: 9,
        description: 'The Fellow Stagg EKG is the gold standard in electric gooseneck kettles. Precision temperature control.',
        short_description: 'Precision gooseneck kettle for professional pour-over control.',
        rating: 4.8, review_count: 42, featured: false, badge: 'Premium',
        image_url: 'https://images.unsplash.com/photo-1726922853685-564851ca79d7?w=800',
      },
    ];

    for (const data of productData) {
      await Product.findOrCreate({
        where: { name: data.name },
        defaults: data,
      });
    }

    console.log('✅  Products seeded.');
    console.log('\n🎉  Seed complete! You can now start the server with: npm run dev');

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err);
    await sequelize.close();
    process.exit(1);
  }
};

seed();
