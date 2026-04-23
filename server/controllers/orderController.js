/**
 * controllers/orderController.js
 *
 * createOrder  — Transactional order placement with inventory guardrail.
 * getMyOrders  — Customer retrieves their own order history.
 * getOrderById – Single order (customer can only view their own; admins see all).
 * getAllOrders – Admin: paginated list of all orders with filters.
 * updateStatus – Admin: update order status.
 *
 * ─── INVENTORY GUARDRAIL + TRANSACTION LOGIC ────────────────────────────────
 *
 * createOrder runs inside a Sequelize managed transaction:
 *
 *   1. Lock all requested Product rows for update (SELECT ... FOR UPDATE)
 *      to prevent race conditions between concurrent checkouts.
 *   2. Validate requested_quantity <= stock for EVERY item.
 *      If ANY item fails → rollback (no order is created, no stock changes).
 *   3. Atomically decrement each product's stock.
 *   4. Create the Order row.
 *   5. Bulk-create OrderDetail rows.
 *   6. Commit.
 *
 * If ANY step throws, Sequelize automatically rolls back the transaction.
 */

const { sequelize, Order, OrderDetail, Product, User } = require('../models');

// ─── Create Order ─────────────────────────────────────────────────────────────

/**
 * POST /api/orders
 * Auth: verifyToken (any logged-in customer or admin can place an order)
 *
 * Request body:
 * {
 *   items: [
 *     { product_id: 1, quantity: 2 },
 *     { product_id: 5, quantity: 1 }
 *   ],
 *   shipping_address: { street, city, state, zip, country },
 *   notes: "Leave at door"   // optional
 * }
 */
const createOrder = async (req, res) => {
  const { items, shipping_address, notes } = req.body;

  // ── Basic request validation ───────────────────────────────────────────────
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(422).json({ success: false, message: 'Order must contain at least one item.' });
  }
  if (!shipping_address?.street || !shipping_address?.city) {
    return res.status(422).json({ success: false, message: 'A complete shipping address is required.' });
  }

  // De-duplicate items (sum quantities for repeated product_ids)
  const itemMap = new Map();
  for (const item of items) {
    const pid = parseInt(item.product_id, 10);
    const qty = parseInt(item.quantity, 10);
    if (!pid || qty < 1) {
      return res.status(422).json({ success: false, message: 'Each item must have a valid product_id and quantity >= 1.' });
    }
    itemMap.set(pid, (itemMap.get(pid) || 0) + qty);
  }

  const productIds      = [...itemMap.keys()];
  const requestedQtyMap = itemMap;

  // ── Begin managed Sequelize transaction ───────────────────────────────────
  const t = await sequelize.transaction();

  try {
    // ── Step 1: Lock product rows for update to prevent race conditions ────
    const products = await Product.findAll({
      where: { id: productIds },
      lock:  t.LOCK.UPDATE,    // SELECT ... FOR UPDATE
      transaction: t,
    });

    // Ensure all requested products actually exist
    if (products.length !== productIds.length) {
      const foundIds  = products.map((p) => p.id);
      const missingId = productIds.find((id) => !foundIds.includes(id));
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: `Product with id ${missingId} not found.`,
      });
    }

    // ── Step 2: Inventory guardrail — check ALL items before touching stock ─
    const stockErrors = [];

    for (const product of products) {
      const requested = requestedQtyMap.get(product.id);
      if (requested > product.stock) {
        stockErrors.push({
          product_id:   product.id,
          product_name: product.name,
          requested,
          available:    product.stock,
        });
      }
    }

    if (stockErrors.length > 0) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'Insufficient stock for one or more items.',
        stockErrors,
      });
    }

    // ── Step 3: Atomically decrement each product's stock ──────────────────
    for (const product of products) {
      const requested = requestedQtyMap.get(product.id);
      await product.decrement('stock', { by: requested, transaction: t });
    }

    // ── Step 4: Compute totals ─────────────────────────────────────────────
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const detailRows = [];

    for (const [productId, quantity] of requestedQtyMap.entries()) {
      const product    = productMap.get(productId);
      const unit_price = parseFloat(product.price);
      subtotal        += unit_price * quantity;
      detailRows.push({ product_id: productId, quantity, unit_price });
    }

    const shipping_cost = subtotal >= 50 ? 0 : 5.99;          // free shipping over $50
    const total         = subtotal + shipping_cost;

    // ── Step 5: Create the Order row ───────────────────────────────────────
    const order = await Order.create(
      {
        user_id: req.user.id,
        status:  'Pending',
        subtotal,
        shipping_cost,
        total,
        shipping_address,
        notes: notes || null,
      },
      { transaction: t },
    );

    // ── Step 6: Bulk-create OrderDetail rows ──────────────────────────────
    const orderDetails = detailRows.map((row) => ({
      ...row,
      order_id: order.id,
    }));

    await OrderDetail.bulkCreate(orderDetails, { transaction: t });

    // ── Step 7: Commit ─────────────────────────────────────────────────────
    await t.commit();

    // Fetch the full order with details for the response
    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderDetail,
          as:    'orderDetails',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image_url'] }],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data:    fullOrder,
    });

  } catch (err) {
    // Rollback on any unexpected error
    await t.rollback();
    console.error('[orderController.createOrder]', err);
    return res.status(500).json({ success: false, message: 'Order could not be placed. Please try again.' });
  }
};

// ─── Get My Orders (Customer) ─────────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: OrderDetail,
          as:    'orderDetails',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image_url', 'price'] }],
        },
      ],
    });

    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.error('[orderController.getMyOrders]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get Single Order ─────────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderDetail,
          as:    'orderDetails',
          include: [{ model: Product, as: 'product' }],
        },
        { model: User, as: 'customer', attributes: ['id', 'username', 'email'] },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Customers can only view their own orders
    if (req.user.role !== 'Admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error('[orderController.getOrderById]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page  || '1',  10));
    const limit  = Math.min(100, parseInt(req.query.limit || '20', 10));
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status)  where.status  = req.query.status;
    if (req.query.user_id) where.user_id = parseInt(req.query.user_id, 10);

    const { rows: orders, count: total } = await Order.findAndCountAll({
      where,
      order:  [['created_at', 'DESC']],
      limit,
      offset,
      include: [
        { model: User,        as: 'customer',    attributes: ['id', 'username', 'email'] },
        { model: OrderDetail, as: 'orderDetails',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image_url'] }] },
      ],
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      data:    orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('[orderController.getAllOrders]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// ─── Update Order Status (Admin) ──────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const VALID = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

    if (!VALID.includes(status)) {
      return res.status(422).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID.join(', ')}.`,
      });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Business rule: completed or cancelled orders cannot be changed
    if (['Completed', 'Cancelled'].includes(order.status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot update a ${order.status} order.`,
      });
    }

    await order.update({ status });
    return res.status(200).json({ success: true, message: 'Order status updated.', data: order });
  } catch (err) {
    console.error('[orderController.updateOrderStatus]', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
