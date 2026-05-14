-- =============================================================================
-- Fondo — MySQL 8.0+ Database Schema
-- =============================================================================
-- Run this file once to initialise the database:
--   mysql -u root -p < server/schema.sql
-- Or via a MySQL client: SOURCE /path/to/server/schema.sql;
-- =============================================================================

-- 1. Create & select the database
-- -----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS fondo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fondo;

-- =============================================================================
-- 2. USERS
-- Business rules:
--   • username must be unique (no duplicate handles)
--   • email must be unique
--   • password is stored as a bcrypt hash — never plaintext
--   • role defaults to 'Customer'; only 'Admin' or 'Customer' allowed
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT            UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(100)   NOT NULL,
  email         VARCHAR(255)   NOT NULL,
  password      VARCHAR(255)   NOT NULL               COMMENT 'bcrypt hash — never store plaintext',
  role          ENUM('Admin','Customer')
                               NOT NULL DEFAULT 'Customer',
  is_active     TINYINT(1)     NOT NULL DEFAULT 1,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email    (email),
  KEY idx_users_role           (role),
  KEY idx_users_is_active      (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- 3. CATEGORIES
-- Business rules:
--   • slug must be URL-safe and unique (used for filtering)
-- =============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id          INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL                    COMMENT 'URL-safe identifier, e.g. whole-bean',
  description TEXT,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- 4. PRODUCTS
-- Business rules:
--   • price must be >= 0 (enforced by CHECK constraint)
--   • stock must be >= 0 (enforced by CHECK constraint)
--   • category_id references categories — DELETE RESTRICT (cannot delete a
--     category that has products)
--   • flavor_notes stored as JSON array, e.g. ["Jasmine","Peach"]
-- =============================================================================
CREATE TABLE IF NOT EXISTS products (
  id                 INT            UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id        INT            UNSIGNED NOT NULL,
  name               VARCHAR(200)   NOT NULL,
  short_description  VARCHAR(500),
  description        TEXT,
  price              DECIMAL(10,2)  NOT NULL CHECK (price >= 0),
  original_price     DECIMAL(10,2)  NULL       CHECK (original_price >= 0)
                                               COMMENT 'Optional: pre-sale price',
  stock              INT            NOT NULL DEFAULT 0 CHECK (stock >= 0),
  roast_level        ENUM('Light','Medium','Dark') NULL,
  origin             VARCHAR(100)   NULL,
  processing_method  ENUM('Washed','Natural','Anaerobic','Honey') NULL,
  weight             VARCHAR(20)    NULL       COMMENT 'e.g. 250g',
  flavor_notes       JSON           NULL       COMMENT 'JSON array of strings',
  image_url          VARCHAR(2048)   NULL,
  badge              VARCHAR(50)    NULL       COMMENT 'e.g. Bestseller, Limited',
  rating             DECIMAL(3,2)   NOT NULL DEFAULT 0.00,
  review_count       INT            NOT NULL DEFAULT 0,
  featured           TINYINT(1)     NOT NULL DEFAULT 0,
  created_at         TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                             ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  KEY idx_products_category    (category_id),
  KEY idx_products_roast       (roast_level),
  KEY idx_products_origin      (origin),
  KEY idx_products_processing  (processing_method),
  KEY idx_products_featured    (featured),
  KEY idx_products_price       (price),
  FULLTEXT KEY ft_products_search (name, short_description, origin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- 5. ORDERS
-- Business rules:
--   • subtotal, shipping_cost, and total must be >= 0
--   • user_id is SET NULL on user deletion (preserve order history)
--   • shipping_address stored as JSON object matching the frontend interface
--   • status follows the lifecycle: Pending → Processing → Shipped → Completed
--     (or Cancelled from any state)
-- =============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id               INT            UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          INT            UNSIGNED NULL        COMMENT 'NULL = guest order',
  status           ENUM('Pending','Processing','Shipped','Completed','Cancelled')
                                  NOT NULL DEFAULT 'Pending',
  subtotal         DECIMAL(10,2)  NOT NULL CHECK (subtotal >= 0),
  shipping_cost    DECIMAL(10,2)  NOT NULL DEFAULT 0.00 CHECK (shipping_cost >= 0),
  total            DECIMAL(10,2)  NOT NULL CHECK (total >= 0),
  shipping_address JSON           NOT NULL             COMMENT '{"street","city","state","zip","country"}',
  payment_method   ENUM('card','paypal','applepay') NOT NULL DEFAULT 'card',
  notes            TEXT           NULL,
  created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                           ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  KEY idx_orders_user_id   (user_id),
  KEY idx_orders_status    (status),
  KEY idx_orders_created   (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- 6. ORDER ITEMS (line items within an order)
-- Business rules:
--   • quantity must be > 0
--   • unit_price must be >= 0 (snapshot of price at time of purchase)
--   • order deletion cascades to items
--   • product deletion is RESTRICTED — archive products instead
-- =============================================================================
CREATE TABLE IF NOT EXISTS order_details (
  id              INT            UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id        INT            UNSIGNED NOT NULL,
  product_id      INT            UNSIGNED NOT NULL,
  quantity        INT            NOT NULL CHECK (quantity > 0),
  unit_price      DECIMAL(10,2)  NOT NULL CHECK (unit_price >= 0),
  grind_size      VARCHAR(50)    NULL     COMMENT 'e.g. Pour Over, Espresso',
  selected_weight VARCHAR(20)    NULL     COMMENT 'e.g. 250g, 500g, 1kg',
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_order_details_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_order_details_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  KEY idx_order_details_order   (order_id),
  KEY idx_order_details_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- 7. BREWING GUIDES
-- Stores the educational content served by the /guides page.
-- steps and equipment stored as JSON arrays for flexible structure.
-- =============================================================================
CREATE TABLE IF NOT EXISTS brewing_guides (
  id           INT            UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  method       VARCHAR(100)   NOT NULL              COMMENT 'e.g. Pour Over',
  slug         VARCHAR(100)   NOT NULL              COMMENT 'URL key, e.g. pour-over',
  tagline      VARCHAR(255)   NULL,
  description  TEXT           NULL,
  difficulty   ENUM('Beginner','Intermediate','Advanced') NOT NULL,
  brew_time    VARCHAR(50)    NULL                  COMMENT 'e.g. 4–5 min',
  water_temp   VARCHAR(80)    NULL                  COMMENT 'e.g. 90–96 °C / 194–205 °F',
  grind_size   VARCHAR(50)    NULL                  COMMENT 'e.g. Medium-Fine',
  grind_detail TEXT           NULL,
  ratio        VARCHAR(30)    NULL                  COMMENT 'e.g. 1:15',
  brew_yield   VARCHAR(50)    NULL                  COMMENT 'e.g. 300 ml',
  equipment    JSON           NULL                  COMMENT 'JSON string array',
  steps        JSON           NULL                  COMMENT 'JSON [{title, detail}]',
  pro_tips     JSON           NULL                  COMMENT 'JSON string array',
  best_with    VARCHAR(255)   NULL,
  flavor_profile VARCHAR(255) NULL,
  recommended_roast VARCHAR(255) NULL,
  image_url    VARCHAR(2048)   NULL,
  featured     TINYINT(1)     NOT NULL DEFAULT 0,
  sort_order   TINYINT        NOT NULL DEFAULT 0    COMMENT 'Display order in UI',
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_brewing_guides_slug (slug),
  KEY idx_brewing_guides_difficulty (difficulty),
  KEY idx_brewing_guides_featured   (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- 8. SEED DATA — Categories
-- =============================================================================
INSERT IGNORE INTO categories (name, slug, description) VALUES
  ('Whole Bean',    'whole-bean',  'Fresh whole beans for the ultimate grind experience'),
  ('Ground Coffee', 'ground',      'Pre-ground for convenience without compromise'),
  ('Accessories',   'accessories', 'Premium brewing tools and equipment');


-- =============================================================================
-- 9. SEED DATA — Admin user
--    Password: artisan2024!  →  bcrypt hash (cost 12)
--    !! Replace this hash with a freshly generated one before production !!
-- =============================================================================
INSERT IGNORE INTO users (username, email, password, role) VALUES
  ('admin',
   'admin@artisanbean.com',
   '$2b$12$XJqWg6h4xSlkS2JyJkrV3.PlaceholderHashReplaceBeforeProd',
   'Admin');


-- =============================================================================
-- 10. SEED DATA — Brewing guides
-- =============================================================================
INSERT IGNORE INTO brewing_guides
  (method, slug, tagline, difficulty, brew_time, water_temp, grind_size, ratio,
   brew_yield, featured, sort_order) VALUES
  ('Pour Over',   'pour-over',   'Clarity, control, and extraordinary nuance',   'Intermediate', '4–5 min',      '90–96 °C / 194–205 °F', 'Medium-Fine', '1:15', '300 ml', 1, 1),
  ('Espresso',    'espresso',    'Concentrated intensity — the foundation of all café drinks', 'Advanced',      '25–30 sec',    '90–94 °C / 194–201 °F', 'Fine',         '1:2',  '36–40 g', 1, 2),
  ('Moka Pot',    'moka-pot',    'The Italian stovetop classic — bold and accessible', 'Beginner',  '5–7 min',      '~95 °C pre-boiled',      'Medium-Fine', 'Fill basket', '120–180 ml', 0, 3),
  ('French Press','french-press','Full immersion brewing — rich body and effortless simplicity', 'Beginner', '4 min steep',  '93–96 °C / 199–205 °F', 'Coarse',       '1:15', '400–600 ml', 0, 4),
  ('AeroPress',   'aeropress',   'The most versatile brewer ever made',           'Intermediate', '1:30–2 min',   '80–92 °C / 176–198 °F', 'Medium-Fine', '1:10–1:14', '150–220 ml', 0, 5),
  ('Cold Brew',   'cold-brew',   'Patience rewarded — smooth, sweet, and ultra-low acidity', 'Beginner', '12–24 hours', 'Room temp / Fridge',     'Extra Coarse', '1:8',  '400–800 ml', 0, 6);


-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
