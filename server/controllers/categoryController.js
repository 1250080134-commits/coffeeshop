/**
 * controllers/categoryController.js
 *
 * Public:
<<<<<<< HEAD
 *   GET  /api/categories         – list all categories (with product count)
 *   GET  /api/categories/:id     – single category with its products
=======
 *   GET  /api/categories         – list all categories
 *   GET  /api/categories/:id     – single category with products
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
 *
 * Admin-only:
 *   POST   /api/categories       – create
 *   PUT    /api/categories/:id   – update
<<<<<<< HEAD
 *   DELETE /api/categories/:id   – delete (only if no products are linked)
=======
 *   DELETE /api/categories/:id   – delete (only if no products linked)
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
 */

const { Category, Product } = require('../models');

<<<<<<< HEAD
// ─── Helper: auto-generate slug from name if not supplied ─────────────────────
const toSlug = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

=======
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
// ─── List All ─────────────────────────────────────────────────────────────────
const getAllCategories = async (_req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
      include: [
        {
          model:      Product,
          as:         'products',
<<<<<<< HEAD
          attributes: ['id'],   // only need IDs for count
=======
          attributes: ['id'],   // only need count
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
        },
      ],
    });

<<<<<<< HEAD
    // Append product count convenience field; strip full array from list view
    const data = categories.map((cat) => ({
      ...cat.toJSON(),
      productCount: cat.products.length,
      products:     undefined,
=======
    // Append product count convenience field
    const data = categories.map((cat) => ({
      ...cat.toJSON(),
      productCount: cat.products.length,
      products:     undefined,   // strip full products array from this list view
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
<<<<<<< HEAD
    const { name, slug, description } = req.body;
=======
    const { name, description } = req.body;
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74

    if (!name?.trim()) {
      return res.status(422).json({ success: false, message: 'Category name is required.' });
    }

<<<<<<< HEAD
    // Auto-generate slug from name when not explicitly provided
    const resolvedSlug = slug?.trim() ? slug.trim().toLowerCase() : toSlug(name.trim());

    const category = await Category.create({
      name:        name.trim(),
      slug:        resolvedSlug,
      description: description || null,
    });
=======
    const category = await Category.create({ name: name.trim(), description });
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74

    return res.status(201).json({
      success: true,
      message: 'Category created.',
      data:    category,
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
<<<<<<< HEAD
      return res.status(409).json({ success: false, message: 'A category with this name or slug already exists.' });
=======
      return res.status(409).json({ success: false, message: 'A category with this name already exists.' });
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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

<<<<<<< HEAD
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
=======
    const { name, description } = req.body;
    await category.update({
      ...(name        !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description }),
    });
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74

    return res.status(200).json({ success: true, message: 'Category updated.', data: category });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
<<<<<<< HEAD
      return res.status(409).json({ success: false, message: 'A category with this name or slug already exists.' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors:  err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
=======
      return res.status(409).json({ success: false, message: 'A category with this name already exists.' });
>>>>>>> e894781abe9e9da34ab7766a384f0b3ac9492f74
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
