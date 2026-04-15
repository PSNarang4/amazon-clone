const express = require('express');
const router = express.Router();
const db = require('../config/db');

const DEFAULT_USER_ID = 1;

// generate a readable order ID like ORD-250415-X8K2
function generateOrderId() {
  const date = new Date();
  const datePart = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${datePart}-${random}`;
}

// GET /api/orders - order history
router.get('/', async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY placed_at DESC
    `, [DEFAULT_USER_ID]);

    // attach items to each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const [items] = await db.query(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [order.order_id]
      );
      return { ...order, items };
    }));

    res.json({ success: true, data: ordersWithItems });
  } catch (err) {
    console.error('Orders fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:orderId - single order detail
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const [[order]] = await db.query(
      `SELECT * FROM orders WHERE order_id = ? AND user_id = ?`,
      [orderId, DEFAULT_USER_ID]
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const [items] = await db.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    res.json({ success: true, data: { ...order, items } });
  } catch (err) {
    console.error('Order detail error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

// POST /api/orders - place a new order
router.post('/', async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      shipping_name,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_pincode,
      shipping_phone,
      payment_method = 'cod'
    } = req.body;

    // validation
    if (!shipping_address || !shipping_city || !shipping_pincode) {
      return res.status(400).json({ success: false, message: 'Shipping details are required' });
    }

    // fetch cart items
    const [cartItems] = await conn.query(`
      SELECT 
        ci.quantity,
        p.id as product_id,
        p.name,
        p.price,
        p.stock,
        pi.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = true
      WHERE ci.user_id = ?
    `, [DEFAULT_USER_ID]);

    if (cartItems.length === 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // check stock for each item
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await conn.rollback();
        return res.status(400).json({
          success: false,
          message: `"${item.name}" only has ${item.stock} units left in stock`
        });
      }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping_fee = subtotal > 499 ? 0 : 40;
    const total = subtotal + shipping_fee;
    const orderId = generateOrderId();

    // insert order
    await conn.query(`
      INSERT INTO orders 
      (order_id, user_id, subtotal, shipping_fee, total, shipping_name, shipping_address, shipping_city, shipping_state, shipping_pincode, shipping_phone, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [orderId, DEFAULT_USER_ID, subtotal, shipping_fee, total, shipping_name, shipping_address, shipping_city, shipping_state, shipping_pincode, shipping_phone, payment_method]);

    // insert order items
    for (const item of cartItems) {
      await conn.query(`
        INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [orderId, item.product_id, item.name, item.image_url, item.price, item.quantity]);

      // deduct stock
      await conn.query(
        `UPDATE products SET stock = stock - ? WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    // clear the cart
    await conn.query('DELETE FROM cart_items WHERE user_id = ?', [DEFAULT_USER_ID]);

    await conn.commit();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order_id: orderId,
        total,
        items_count: cartItems.length
      }
    });
  } catch (err) {
    await conn.rollback();
    console.error('Place order error:', err);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  } finally {
    conn.release();
  }
});

module.exports = router;
