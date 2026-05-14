/**
 * controllers/brewingGuideController.js
 *
 * Public:
 *   GET  /api/guides          – list all guides (sorted by sort_order)
 *   GET  /api/guides/featured – featured guides only
 *   GET  /api/guides/:slug    – single guide by slug
 *
 * Admin-only:
 *   POST   /api/guides        – create a guide
 *   PUT    /api/guides/:slug  – update a guide
 *   DELETE /api/guides/:slug  – delete a guide
 */

const { BrewingGuide } = require('../models');

// ─── List All ─────────────────────────────────────────────────────────────────
const getAllGuides = async (_req, res) => {
  try {
    const guides = await BrewingGuide.findAll({
      order: [['sort_order', 'ASC'], ['method', 'ASC']],
    });
    return res.status(200).json({ success: true, data: guides });
  } catch (err) {
    console.error('[brewingGuideController.getAllGuides]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Featured Guides ──────────────────────────────────────────────────────────
const getFeaturedGuides = async (_req, res) => {
  try {
    const guides = await BrewingGuide.findAll({
      where: { featured: true },
      order: [['sort_order', 'ASC']],
    });
    return res.status(200).json({ success: true, data: guides });
  } catch (err) {
    console.error('[brewingGuideController.getFeaturedGuides]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get Single Guide by Slug ─────────────────────────────────────────────────
const getGuideBySlug = async (req, res) => {
  try {
    const guide = await BrewingGuide.findOne({
      where: { slug: req.params.slug },
    });

    if (!guide) {
      return res.status(404).json({ success: false, message: 'Brewing guide not found.' });
    }

    return res.status(200).json({ success: true, data: guide });
  } catch (err) {
    console.error('[brewingGuideController.getGuideBySlug]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Create (Admin) ───────────────────────────────────────────────────────────
const createGuide = async (req, res) => {
  try {
    const {
      method, slug, tagline, description, difficulty,
      brew_time, water_temp, grind_size, grind_detail,
      ratio, brew_yield, equipment, steps, pro_tips,
      best_with, flavor_profile, recommended_roast,
      image_url, featured, sort_order,
    } = req.body;

    if (!method?.trim() || !slug?.trim() || !difficulty) {
      return res.status(422).json({
        success: false,
        message: 'method, slug, and difficulty are required.',
      });
    }

    const guide = await BrewingGuide.create({
      method: method.trim(),
      slug: slug.trim().toLowerCase(),
      tagline, description, difficulty,
      brew_time, water_temp, grind_size, grind_detail,
      ratio, brew_yield, equipment, steps, pro_tips,
      best_with, flavor_profile, recommended_roast,
      image_url,
      featured: featured ?? false,
      sort_order: sort_order ?? 0,
    });

    return res.status(201).json({ success: true, message: 'Brewing guide created.', data: guide });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'A guide with this slug already exists.' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors:  err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    console.error('[brewingGuideController.createGuide]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Update (Admin) ───────────────────────────────────────────────────────────
const updateGuide = async (req, res) => {
  try {
    const guide = await BrewingGuide.findOne({ where: { slug: req.params.slug } });
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Brewing guide not found.' });
    }

    const allowedFields = [
      'method', 'tagline', 'description', 'difficulty',
      'brew_time', 'water_temp', 'grind_size', 'grind_detail',
      'ratio', 'brew_yield', 'equipment', 'steps', 'pro_tips',
      'best_with', 'flavor_profile', 'recommended_roast',
      'image_url', 'featured', 'sort_order',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    await guide.update(updates);
    return res.status(200).json({ success: true, message: 'Brewing guide updated.', data: guide });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors:  err.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }
    console.error('[brewingGuideController.updateGuide]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Delete (Admin) ───────────────────────────────────────────────────────────
const deleteGuide = async (req, res) => {
  try {
    const guide = await BrewingGuide.findOne({ where: { slug: req.params.slug } });
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Brewing guide not found.' });
    }

    await guide.destroy();
    return res.status(200).json({ success: true, message: 'Brewing guide deleted.' });
  } catch (err) {
    console.error('[brewingGuideController.deleteGuide]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  getAllGuides,
  getFeaturedGuides,
  getGuideBySlug,
  createGuide,
  updateGuide,
  deleteGuide,
};
