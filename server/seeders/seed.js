/**
 * seeders/seed.js
 *
<<<<<<< HEAD
 * Populates the database with the Fondo initial dataset.
 * Run with: node seeders/seed.js  OR  npm run db:seed
 *
 * Idempotent — skips any record that already exists (findOrCreate).
 *
 * Seed order (respects FK constraints):
 *   1. Categories (no deps)
 *   2. Users      (no deps)
 *   3. Products   (→ categories)
 *   4. BrewingGuides (no deps)
=======
 * Populates the database with the Artisan Bean Hub initial dataset.
 * Run with: node seeders/seed.js
 *
 * Idempotent — skips any record that already exists.
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

<<<<<<< HEAD
const { sequelize, User, Category, Product, BrewingGuide } = require('../models');
=======
const { sequelize, User, Category, Product } = require('../models');
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  Connected to database.');

<<<<<<< HEAD
    // ── 1. Categories ──────────────────────────────────────────────────────
    const [wholeBeanCat] = await Category.findOrCreate({
      where: { slug: 'whole-bean' },
      defaults: { name: 'Whole Bean',    slug: 'whole-bean',  description: 'Fresh whole beans for the ultimate grind experience' },
    });
    const [groundCat] = await Category.findOrCreate({
      where: { slug: 'ground' },
      defaults: { name: 'Ground Coffee', slug: 'ground',      description: 'Pre-ground for convenience without compromise' },
    });
    const [accessoryCat] = await Category.findOrCreate({
      where: { slug: 'accessories' },
      defaults: { name: 'Accessories',   slug: 'accessories', description: 'Premium brewing tools and equipment' },
    });

    console.log('✅  Categories seeded.');

    // ── 2. Admin Users ─────────────────────────────────────────────────────
=======
    // ── Categories ────────────────────────────────────────────────────────
    const [wholeBeanCat]  = await Category.findOrCreate({ where: { name: 'Whole Bean' },    defaults: { description: 'Fresh whole beans for the ultimate grind experience' } });
    const [groundCat]     = await Category.findOrCreate({ where: { name: 'Ground Coffee' }, defaults: { description: 'Pre-ground for convenience without compromise' } });
    const [accessoryCat]  = await Category.findOrCreate({ where: { name: 'Accessories' },   defaults: { description: 'Premium brewing tools and equipment' } });

    console.log('✅  Categories seeded.');

    // ── Admin User ────────────────────────────────────────────────────────
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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

<<<<<<< HEAD
    // Demo customer
    await User.findOrCreate({
      where: { email: 'sarah.m@email.com' },
      defaults: {
        username: 'sarahm',
        password: 'Customer@123',
        role:     'Customer',
      },
    });

    console.log('✅  Users seeded.');

    // ── 3. Products ────────────────────────────────────────────────────────
=======
    console.log('✅  Admin users seeded.');

    // ── Products ──────────────────────────────────────────────────────────
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
    const productData = [
      {
        name: 'Ethiopia Yirgacheffe',
        category_id: wholeBeanCat.id,
        price: 22.00, stock: 48, roast_level: 'Light',
        origin: 'Ethiopia', processing_method: 'Washed',
<<<<<<< HEAD
        description: 'Grown at high altitudes in the birthplace of coffee, this Yirgacheffe delivers an exceptionally clean cup with bright acidity and floral complexity.',
=======
        description: 'Grown at high altitudes in the birthplace of coffee, this Yirgacheffe delivers an exceptionally clean cup with bright acidity.',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
        description: 'Sourced from family farms in the Huila department, nestled in the Andes mountains at 1,700m elevation.',
=======
        description: 'Sourced from family farms in the Huila department, nestled in the Andes mountains.',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
        description: "Kenya AA represents the country's highest grade, selected for size, density, and cup quality from the Kirinyaga region.",
=======
        description: 'Kenya AA represents the country\'s highest grade, with beans selected for size, density, and cup quality.',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
        description: 'This experimental lot undergoes anaerobic fermentation before drying, pushing flavor boundaries with intense tropical fruit character.',
=======
        description: 'This experimental lot undergoes anaerobic fermentation before drying, pushing flavor boundaries.',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
        description: 'The legendary Geisha variety from Panama — the most celebrated coffee in the world. Exceptionally limited.',
        short_description: "The world's most celebrated variety — floral, tea-like, extraordinary.",
=======
        description: 'The legendary Geisha variety from Panama — the most celebrated coffee in the world.',
        short_description: 'The world\'s most celebrated variety — floral, tea-like, extraordinary.',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
        weight: '100g', flavor_notes: ['Jasmine Tea', 'Stone Fruit', 'Elderflower', 'Honey'],
        rating: 5.0, review_count: 31, featured: false, badge: 'Rare',
        image_url: 'https://images.unsplash.com/photo-1672851612794-6687bf0bf1a3?w=800',
      },
      {
        name: 'Brazil Santos Ground',
        category_id: groundCat.id,
        price: 15.00, stock: 89, roast_level: 'Medium',
        origin: 'Brazil', processing_method: 'Natural',
<<<<<<< HEAD
        description: 'Brazil Santos is the quintessential everyday espresso base — naturally processed for a fuller body and natural sweetness.',
=======
        description: 'Brazil Santos is the quintessential everyday espresso base — naturally processed for a fuller body.',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
        description: "Processed using Indonesia's unique wet-hulled method, this Mandheling ground coffee delivers an unmistakable earthy, full-bodied cup.",
=======
        description: 'Processed using Indonesia\'s unique wet-hulled method, this Mandheling ground coffee is unlike anything else.',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
        description: 'Certified organic and shade-grown by indigenous cooperatives in the Cajamarca highlands. Clean, gentle, and ethically exceptional.',
=======
        description: 'Certified organic and shade-grown by indigenous cooperatives in the Cajamarca highlands.',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
        short_description: 'Clean, gentle, and sustainable — ideal for filter brewing.',
        weight: '250g', flavor_notes: ['Milk Chocolate', 'Walnut', 'Sweet Citrus', 'Honey'],
        rating: 4.6, review_count: 55, featured: false, badge: 'Organic',
        image_url: 'https://images.unsplash.com/photo-1775451152836-e68a116b48c4?w=800',
      },
      {
        name: 'Hario V60 Pour Over Kit',
        category_id: accessoryCat.id,
        price: 45.00, stock: 18,
<<<<<<< HEAD
        description: 'The iconic Hario V60 ceramic dripper bundled with a server, 100 filters, and a measuring spoon. Everything you need to start your pour-over journey.',
=======
        description: 'The iconic Hario V60 ceramic dripper bundled with a server, 100 filters, and a measuring spoon.',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
        short_description: 'Complete V60 pour-over starter kit for the discerning brewer.',
        rating: 4.9, review_count: 89, featured: true, badge: 'Top Pick',
        image_url: 'https://images.unsplash.com/photo-1764807504818-a704510e2a21?w=800',
      },
      {
        name: 'Fellow Stagg EKG Kettle',
        category_id: accessoryCat.id,
        price: 165.00, stock: 9,
<<<<<<< HEAD
        description: 'The Fellow Stagg EKG is the gold standard in electric gooseneck kettles. 1°C precision temperature control and a stopwatch mode for timing pours.',
=======
        description: 'The Fellow Stagg EKG is the gold standard in electric gooseneck kettles. Precision temperature control.',
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
        short_description: 'Precision gooseneck kettle for professional pour-over control.',
        rating: 4.8, review_count: 42, featured: false, badge: 'Premium',
        image_url: 'https://images.unsplash.com/photo-1726922853685-564851ca79d7?w=800',
      },
    ];

    for (const data of productData) {
<<<<<<< HEAD
      await Product.findOrCreate({ where: { name: data.name }, defaults: data });
    }

    console.log('✅  Products seeded.');

    // ── 4. Brewing Guides ──────────────────────────────────────────────────
    const guideData = [
      {
        method: 'Pour Over', slug: 'pour-over',
        tagline: 'Clarity, control, and extraordinary nuance',
        difficulty: 'Intermediate', brew_time: '4–5 min',
        water_temp: '90–96 °C / 194–205 °F', grind_size: 'Medium-Fine',
        grind_detail: 'Similar to table salt. Too fine = bitter over-extraction; too coarse = sour under-extraction.',
        ratio: '1:15', brew_yield: '300 ml',
        equipment: ['V60 or Kalita Wave dripper', 'Paper filter (rinsed)', 'Gooseneck kettle', 'Scale (0.1 g precision)', 'Timer', 'Server or cup', '20 g coffee'],
        steps: [
          { title: 'Preheat & Rinse', detail: 'Place filter in dripper, rinse with hot water to eliminate paper taste. Discard rinse water.' },
          { title: 'Weigh & Grind', detail: 'Grind 20 g of coffee fresh to medium-fine (table salt). Pour into filter and level.' },
          { title: 'Bloom — 0:00–0:30', detail: 'Pour 40 g of 93 °C water in a spiral. Watch grounds bloom (CO₂ escaping). Wait 30 s.' },
          { title: 'First Pour — 0:30–1:15', detail: 'Pour 100 g more in a spiral. Keep water off filter walls. Total: 140 g.' },
          { title: 'Second Pour — 1:15–2:00', detail: 'Add 80 g. Keep water 1 cm below rim. Total: 220 g.' },
          { title: 'Final Pour — 2:00–2:45', detail: 'Add final 80 g. Total water: 300 g.' },
          { title: 'Wait for Drawdown', detail: 'Full drain targets 4:00–4:30. Faster = grind coarser; slower = grind finer.' },
        ],
        pro_tips: [
          'Use filtered water with 75–150 ppm TDS.',
          'A gooseneck kettle is essential for pour control.',
          'Bloom 45 s for very fresh coffee (< 2 weeks roasted).',
          'Swirl the server gently after brewing to integrate flavors.',
        ],
        best_with: 'Light to medium roasts from washed-process origins',
        flavor_profile: 'Clean, bright, transparent — highlights subtle floral and fruit notes',
        recommended_roast: 'Ethiopia Yirgacheffe · Kenya AA · Colombia Huila',
        image_url: 'https://images.unsplash.com/photo-1748894851733-be6747a9c061?w=800',
        featured: true, sort_order: 1,
      },
      {
        method: 'Espresso', slug: 'espresso',
        tagline: 'Concentrated intensity — the foundation of all café drinks',
        difficulty: 'Advanced', brew_time: '25–30 sec',
        water_temp: '90–94 °C / 194–201 °F', grind_size: 'Fine',
        grind_detail: 'Finer than table salt, almost powdery. Adjust by ±1 click at a time.',
        ratio: '1:2', brew_yield: '36–40 g',
        equipment: ['Espresso machine (9 bar)', 'Burr grinder', 'Portafilter + basket', 'Distribution tool', 'Calibrated tamper', 'Scale (0.1 g)', 'Shot glasses'],
        steps: [
          { title: 'Flush & Preheat', detail: 'Run blank shot through group head for 5 s. Remove portafilter and discard water.' },
          { title: 'Dose', detail: 'Grind 18–20 g directly into basket.' },
          { title: 'Distribute', detail: 'Use WDT tool to break clumps and distribute evenly. Prevents channelling.' },
          { title: 'Tamp', detail: 'Apply ~15 kg of even, level pressure. Twist lightly to polish.' },
          { title: 'Lock In & Pull', detail: 'Lock portafilter, start scale. Target: first drops at 7–9 s, complete in 25–30 s yielding 36–40 g.' },
          { title: 'Evaluate & Adjust', detail: 'Too sour / fast → grind finer. Too bitter / slow → grind coarser. One variable at a time.' },
        ],
        pro_tips: [
          'Pre-infusion at 2–3 bar for 3 s reduces channelling if your machine supports it.',
          'Freshness window: best 4–21 days post-roast.',
          'Purge grinder after every adjustment to clear stale coffee.',
          'Weigh your output — volumetric timers are unreliable.',
        ],
        best_with: 'Medium to dark roasts; blends designed for espresso',
        flavor_profile: 'Concentrated, syrupy, intense — caramel, chocolate, and origin notes in a small package',
        recommended_roast: 'Guatemala Antigua · Brazil Santos · Colombia Huila',
        image_url: 'https://images.unsplash.com/photo-1762657424875-8ec26d3db9f3?w=800',
        featured: true, sort_order: 2,
      },
      {
        method: 'Moka Pot', slug: 'moka-pot',
        tagline: 'The Italian stovetop classic — bold and accessible',
        difficulty: 'Beginner', brew_time: '5–7 min',
        water_temp: '~95 °C pre-boiled', grind_size: 'Medium-Fine',
        grind_detail: 'Like fine sea salt. Too fine causes dangerous pressure build-up.',
        ratio: 'Fill basket', brew_yield: '120–180 ml',
        equipment: ['Moka pot (3-cup or 6-cup)', 'Stove', 'Pre-boiled water', 'Grinder', 'Oven mitt'],
        steps: [
          { title: 'Pre-boil Water', detail: 'Fill bottom chamber with pre-boiled water up to the pressure valve. Never above it.' },
          { title: 'Fill Basket', detail: 'Fill filter basket level. Do NOT tamp.' },
          { title: 'Assemble & Heat', detail: 'Screw on tightly. Place on low-medium heat with lid open.' },
          { title: 'Monitor & Remove', detail: 'Remove when flow turns pale gold and you hear sputtering.' },
          { title: 'Cool & Pour', detail: 'Run cold water over bottom chamber to halt extraction. Serve immediately.' },
        ],
        pro_tips: [
          'Never leave unattended — burnt coffee happens in seconds.',
          'Low heat is the secret to avoiding bitterness.',
          'Clean with water only — no soap. Oils season the metal.',
          '3-cup pots brew stronger per cup than 6-cup.',
        ],
        best_with: 'Medium to dark espresso-style roasts',
        flavor_profile: 'Bold, rich, and concentrated — not quite espresso, more powerful than drip',
        recommended_roast: 'Guatemala Antigua · Brazil Santos · Sumatra Mandheling',
        image_url: 'https://images.unsplash.com/photo-1585683034983-b8c9d72a095a?w=800',
        featured: false, sort_order: 3,
      },
      {
        method: 'French Press', slug: 'french-press',
        tagline: 'Full immersion brewing — rich body and effortless simplicity',
        difficulty: 'Beginner', brew_time: '4 min steep',
        water_temp: '93–96 °C / 199–205 °F', grind_size: 'Coarse',
        grind_detail: 'Coarse, like flaky sea salt or breadcrumbs. Fine grinds pass through the mesh and make the cup gritty.',
        ratio: '1:15', brew_yield: '400–600 ml',
        equipment: ['French press', 'Kettle', 'Scale', 'Timer', 'Spoon', '30–40 g coffee'],
        steps: [
          { title: 'Preheat', detail: 'Swirl hot water in the press and discard.' },
          { title: 'Add Coffee & Water', detail: 'Add coarsely ground coffee. Pour all water at once and stir.' },
          { title: 'Steep — 4 Minutes', detail: 'Place lid on (plunger up) and steep exactly 4 minutes.' },
          { title: 'Plunge Slowly', detail: 'Apply gentle, steady downward pressure. 20–30 s to plunge fully.' },
          { title: 'Serve Immediately', detail: 'Pour all coffee out immediately — leaving it on the grounds causes over-extraction.' },
        ],
        pro_tips: [
          'Pour all coffee out immediately after plunging.',
          'Skim the foam layer before plunging for a cleaner cup.',
          'French press is forgiving — great for darker, earthier coffees.',
          'Steel presses retain heat better than glass.',
        ],
        best_with: 'Medium to dark roasts; naturally processed coffees for extra body',
        flavor_profile: 'Full-bodied, rich, with some sediment — excellent for earthy and chocolate-forward coffees',
        recommended_roast: 'Sumatra Mandheling · Guatemala Antigua · Brazil Santos',
        image_url: 'https://images.unsplash.com/photo-1646799935616-1992b36d254e?w=800',
        featured: false, sort_order: 4,
      },
      {
        method: 'AeroPress', slug: 'aeropress',
        tagline: 'The most versatile brewer ever made',
        difficulty: 'Intermediate', brew_time: '1:30–2 min',
        water_temp: '80–92 °C / 176–198 °F', grind_size: 'Medium-Fine',
        grind_detail: 'Flexible — coarser for longer steep, finer for shorter. One of the AeroPress\'s greatest advantages.',
        ratio: '1:10 to 1:14', brew_yield: '150–220 ml',
        equipment: ['AeroPress', 'Paper or metal filter', 'Kettle', 'Scale', 'Timer', 'Mug', '15–18 g coffee'],
        steps: [
          { title: 'Set Up (Inverted)', detail: 'Flip AeroPress upside down with plunger at number 4. Prevents premature dripping.' },
          { title: 'Rinse Filter', detail: 'Rinse paper filter with hot water. Eliminates paper taste.' },
          { title: 'Add Coffee', detail: 'Add 15 g medium-fine ground coffee. Tap to level.' },
          { title: 'Bloom at Low Temp', detail: 'Pour 30 g of 85 °C water. Stir 5 times. Wait 30 s.' },
          { title: 'Fill & Steep', detail: 'Add remaining water to 150 g. Stir 3 times. Attach filter cap. Steep 1 minute total.' },
          { title: 'Flip & Press', detail: 'Carefully flip onto mug. Press steadily over 20–30 s. Stop at hiss.' },
          { title: 'Dilute to Taste', detail: 'Drink as-is (concentrate) or add 100–150 g hot water for Americano style.' },
        ],
        pro_tips: [
          'Best travel brewer — virtually unbreakable and consistent.',
          'Metal filters = fuller body; paper filters = cleaner, brighter cup.',
          'Try the James Hoffmann recipe: 11 g coffee, 200 g 99°C water, 2 min steep.',
          'Short stir creates more even extraction than long stirring.',
        ],
        best_with: 'Any roast level — highly adaptable',
        flavor_profile: 'Variable by recipe — can produce clean filter-style or rich espresso-like results',
        recommended_roast: 'Costa Rica Tarrazu · Kenya AA · Ethiopia Yirgacheffe',
        image_url: 'https://images.unsplash.com/photo-1598639298075-9f62f1fc5463?w=800',
        featured: false, sort_order: 5,
      },
      {
        method: 'Cold Brew', slug: 'cold-brew',
        tagline: 'Patience rewarded — smooth, sweet, and ultra-low acidity',
        difficulty: 'Beginner', brew_time: '12–24 hours',
        water_temp: 'Room temp (20 °C) or refrigerator (4 °C)', grind_size: 'Extra Coarse',
        grind_detail: 'Coarser than French press — like rough gravel. Fine grounds over-extract in the long steep.',
        ratio: '1:8', brew_yield: '400–800 ml concentrate',
        equipment: ['Large jar or pitcher (1 L+)', 'Fine mesh strainer', 'Coffee filter', 'Scale', '100 g coffee', 'Cold or room-temp water'],
        steps: [
          { title: 'Grind Extra Coarse', detail: 'Grind 100 g on your coarsest setting — noticeably coarser than French press.' },
          { title: 'Combine', detail: 'Add grounds to jar. Pour 800 ml room-temperature filtered water over them.' },
          { title: 'Stir & Submerge', detail: 'Stir to saturate all grounds. Press any floaters below the waterline. Cover loosely.' },
          { title: 'Steep', detail: 'Room temp: 12–14 hours. Fridge: 18–24 hours. Fridge = smoother and sweeter.' },
          { title: 'First Strain', detail: 'Pour through fine mesh strainer to remove bulk of grounds.' },
          { title: 'Second Strain', detail: 'Pour through coffee filter for crystal-clear concentrate. Takes 10–20 min.' },
          { title: 'Store & Dilute', detail: 'Refrigerate up to 14 days. Dilute 1:1 with water or milk over ice.' },
        ],
        pro_tips: [
          'Make a double batch — you will go through it faster than expected.',
          'A pinch of salt suppresses bitterness and enhances sweetness.',
          'Medium roasts work better than dark for cold brew.',
          'Steep time is your biggest variable — experiment freely.',
        ],
        best_with: 'Medium natural or honey-processed origins with sweetness',
        flavor_profile: 'Smooth, chocolatey, low acidity — sweet and clean with almost no bitterness',
        recommended_roast: 'Colombia Huila · Brazil Santos Ground · Peru Organic Ground',
        image_url: 'https://images.unsplash.com/photo-1495221521568-8b714b2cb6fd?w=800',
        featured: false, sort_order: 6,
      },
    ];

    for (const data of guideData) {
      await BrewingGuide.findOrCreate({ where: { slug: data.slug }, defaults: data });
    }

    console.log('✅  Brewing guides seeded.');
    console.log('\n🎉  Seed complete!');
    console.log('   Admin login: admin@artisanbean.com / Admin@12345');
    console.log('   Demo user:   sarah.m@email.com / Customer@123');
    console.log('\n   Start server: npm run dev');
=======
      await Product.findOrCreate({
        where: { name: data.name },
        defaults: data,
      });
    }

    console.log('✅  Products seeded.');
    console.log('\n🎉  Seed complete! You can now start the server with: npm run dev');
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74

    await sequelize.close();
    process.exit(0);
  } catch (err) {
<<<<<<< HEAD
    console.error('❌  Seed failed:', err.message);
    console.error(err.stack);
=======
    console.error('❌  Seed failed:', err);
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
    await sequelize.close();
    process.exit(1);
  }
};

seed();
