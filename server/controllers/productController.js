/**
 * controllers/productController.js
 *
 * Public endpoints:
 *   GET  /api/products           – list with advanced filtering & pagination
 *   GET  /api/products/search    – partial name + exact attribute search
 *   GET  /api/products/:id       – single product detail
 *
 * Admin-only endpoints:
 *   POST   /api/products         – create
 *   PUT    /api/products/:id     – update
 *   DELETE /api/products/:id     – delete
 *   PATCH  /api/products/:id/stock – adjust stock level
 *
 * Advanced Filtering (GET /api/products):
 *   ?roast_level=Light,Medium
 *   ?origin=Ethiopia
 *   ?processing_method=Washed
 *   ?category_id=1
 *   ?min_price=10&max_price=30
 *   ?featured=true
 *   ?page=1&limit=12
 *   ?sort=price_asc | price_desc | rating_desc | newest
 */

const { Product, Category } = require('../models');
const { Op }                = require('sequelize');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a Sequelize WHERE clause from query parameters.
 */
const buildProductWhere = (query) => {
  const where = {};

  // Roast level — accepts comma-separated values: ?roast_level=Light,Dark
  if (query.roast_level) {
    const levels = query.roast_level.split(',').map((s) => s.trim());
    where.roast_level = levels.length === 1 ? levels[0] : { [Op.in]: levels };
  }

  // Origin — exact match, case-insensitive via LOWER()
  if (query.origin) {
    where.origin = { [Op.like]: query.origin.trim() };
  }

  // Processing method — exact match
  if (query.processing_method) {
    where.processing_method = { [Op.like]: query.processing_method.trim() };
  }

  // Category
  if (query.category_id) {
    where.category_id = parseInt(query.category_id, 10);
  }

  // Price range
  if (query.min_price || query.max_price) {
    where.price = {};
    if (query.min_price) where.price[Op.gte] = parseFloat(query.min_price);
    if (query.max_price) where.price[Op.lte] = parseFloat(query.max_price);
  }

  // Featured only
  if (query.featured === 'true') {
    where.featured = true;
  }

  return where;
};

/**
 * Build ORDER BY from a sort string.
 */
const buildProductOrder = (sort) => {
  switch (sort) {
    case 'price_asc':   return [['price',      'ASC']];
    case 'price_desc':  return [['price',      'DESC']];
    case 'rating_desc': return [['rating',     'DESC']];
    case 'newest':      return [['created_at', 'DESC']];
    default:            return [['created_at', 'DESC']];
  }
};

// ─── List Products (with filtering & pagination) ──────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  || '1',  10));
    const limit = Math.min(100, parseInt(req.query.limit || '12', 10));
    const offset = (page - 1) * limit;

    const where = buildProductWhere(req.query);
    const order = buildProductOrder(req.query.sort);

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext:    page * limit < total,
        hasPrev:    page > 1,
      },
    });
  } catch (err) {
    console.error('[productController.getAllProducts]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Search Products ──────────────────────────────────────────────────────────
/**
 * GET /api/products/search
 *
 * Query params:
 *   q                  – partial match on name (LIKE %q%)
 *   origin             – exact match
 *   processing_method  – exact match
 *   roast_level        – exact match
 *   category_id        – exact match
 *
 * This route must be registered BEFORE /:id to avoid "search" being treated as an id.
 */
const searchProducts = async (req, res) => {
  try {
    const { q, origin, processing_method, roast_level, category_id } = req.query;

    if (!q && !origin && !processing_method && !roast_level && !category_id) {
      return res.status(422).json({
        success: false,
        message: 'Provide at least one search parameter: q, origin, processing_method, roast_level, or category_id.',
      });
    }

    const where = {};

    // Partial name match (case-insensitive)
    if (q?.trim()) {
      where.name = { [Op.like]: `%${q.trim()}%` };
    }

    // Exact attribute matches
    if (origin)             where.origin             = { [Op.like]: origin.trim() };
    if (processing_method)  where.processing_method  = processing_method.trim();
    if (roast_level)        where.roast_level        = roast_level.trim();
    if (category_id)        where.category_id        = parseInt(category_id, 10);

    const products = await Product.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order:   [['name', 'ASC']],
      limit:   50,
    });

    return res.status(200).json({
      success: true,
      count:   products.length,
      data:    products,
    });
  } catch (err) {
    console.error('[productController.searchProducts]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get Single Product ────────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error('[productController.getProductById]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Create Product (Admin) ───────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const {
      name, description, short_description,
      price, original_price, stock,
      roast_level, origin, processing_method,
      weight, flavor_notes, image_url,
      badge, rating, review_count, featured,
      category_id,
    } = req.body;

    // Verify category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(422).json({ success: false, message: 'Invalid category_id — category does not exist.' });
    }

    const product = await Product.create({
      name, description, short_description,
      price, original_price, stock: stock ?? 0,
      roast_level, origin, processing_method,
      weight, flavor_notes, image_url,
      badge, rating, review_count: review_count ?? 0,
      featured: featured ?? false,
      category_id,
    });

    const result = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }],
    });

    return res.status(201).json({ success: true, message: 'Product created.', data: result });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors:  err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    console.error('[productController.createProduct]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Update Product (Admin) ───────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Only update fields that were explicitly provided
    const allowedFields = [
      'name', 'description', 'short_description',
      'price', 'original_price', 'stock',
      'roast_level', 'origin', 'processing_method',
      'weight', 'flavor_notes', 'image_url',
      'badge', 'rating', 'review_count', 'featured', 'category_id',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (updates.category_id) {
      const category = await Category.findByPk(updates.category_id);
      if (!category) {
        return res.status(422).json({ success: false, message: 'Invalid category_id.' });
      }
    }

    await product.update(updates);

    const result = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }],
    });

    return res.status(200).json({ success: true, message: 'Product updated.', data: result });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors:  err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    console.error('[productController.updateProduct]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Adjust Stock (Admin) ──────────────────────────────────────────────────────
/**
 * PATCH /api/products/:id/stock
 * Body: { stock: <new_absolute_stock_level> }
 *       OR { adjustment: <positive_or_negative_delta> }
 */
const adjustStock = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (req.body.stock !== undefined) {
      const newStock = parseInt(req.body.stock, 10);
      if (isNaN(newStock) || newStock < 0) {
        return res.status(422).json({ success: false, message: 'Stock must be a non-negative integer.' });
      }
      await product.update({ stock: newStock });
    } else if (req.body.adjustment !== undefined) {
      const delta    = parseInt(req.body.adjustment, 10);
      const newStock = product.stock + delta;
      if (newStock < 0) {
        return res.status(409).json({
          success: false,
          message: `Adjustment would result in negative stock (current: ${product.stock}, delta: ${delta}).`,
        });
      }
      await product.update({ stock: newStock });
    } else {
      return res.status(422).json({ success: false, message: 'Provide stock or adjustment in request body.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Stock updated.',
      data:    { id: product.id, stock: product.stock },
    });
  } catch (err) {
    console.error('[productController.adjustStock]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Delete Product (Admin) ───────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    await product.destroy();
    return res.status(200).json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete — this product exists in one or more orders.',
      });
    }
    console.error('[productController.deleteProduct]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  getAllProducts,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
};
