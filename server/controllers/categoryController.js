/**
 * controllers/categoryController.js
 *
 * Public:
 *   GET  /api/categories         – list all categories (with product count)
 *   GET  /api/categories/:id     – single category with its products
 *
 * Admin-only:
 *   POST   /api/categories       – create
 *   PUT    /api/categories/:id   – update
 *   DELETE /api/categories/:id   – delete (only if no products are linked)
 */

const { Category, Product } = require('../models');

// ─── Helper: auto-generate slug from name if not supplied ─────────────────────
const toSlug = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// ─── List All ─────────────────────────────────────────────────────────────────
const getAllCategories = async (_req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
      include: [
        {
          model:      Product,
          as:         'products',
          attributes: ['id'],   // only need IDs for count
        },
      ],
    });

    // Append product count convenience field; strip full array from list view
    const data = categories.map((cat) => ({
      ...cat.toJSON(),
      productCount: cat.products.length,
      products:     undefined,
    }));

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('[categoryController.getAllCategories]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get Single ───────────────────────────────────────────────────────────────
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product, as: 'products' }],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (err) {
    console.error('[categoryController.getCategoryById]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Create (Admin) ───────────────────────────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name?.trim()) {
      return res.status(422).json({ success: false, message: 'Category name is required.' });
    }

    // Auto-generate slug from name when not explicitly provided
    const resolvedSlug = slug?.trim() ? slug.trim().toLowerCase() : toSlug(name.trim());

    const category = await Category.create({
      name:        name.trim(),
      slug:        resolvedSlug,
      description: description || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created.',
      data:    category,
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'A category with this name or slug already exists.' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors:  err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    console.error('[categoryController.createCategory]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Update (Admin) ───────────────────────────────────────────────────────────
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const { name, slug, description } = req.body;

    const updates = {};
    if (name        !== undefined) updates.name        = name.trim();
    if (slug        !== undefined) updates.slug        = slug.trim().toLowerCase();
    if (description !== undefined) updates.description = description;

    // If name changes and no slug was supplied, regenerate the slug
    if (name && !slug) {
      updates.slug = toSlug(name.trim());
    }

    await category.update(updates);

    return res.status(200).json({ success: true, message: 'Category updated.', data: category });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'A category with this name or slug already exists.' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors:  err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    console.error('[categoryController.updateCategory]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Delete (Admin) ───────────────────────────────────────────────────────────
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product, as: 'products', attributes: ['id'] }],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    if (category.products.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete. ${category.products.length} product(s) are assigned to this category.`,
      });
    }

    await category.destroy();
    return res.status(200).json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    console.error('[categoryController.deleteCategory]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
