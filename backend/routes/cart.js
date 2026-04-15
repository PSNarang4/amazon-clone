const express = require('express');
const router = express.Router();
const db = require('../config/db');

const DEFAULT_USER_ID = 1; // as per spec, no login required

// GET /api/cart - get all cart items for default user
router.get('/', async (req, res) => {
  try {
    const [items] = await db.query(`
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        ci.added_at,
        p.id as product_id,
        p.name,
        p.price,
        p.original_price,
        p.brand,
        p.stock,
        p.is_prime,
        pi.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = true
      WHERE ci.user_id = ?
      ORDER BY ci.added_at DESC
    `, [DEFAULT_USER_ID]);

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      data: {
        items,
        summary: {
          totalItems,
          subtotal: parseFloat(subtotal.toFixed(2)),
          shipping: subtotal > 499 ? 0 : 40,
          total: parseFloat((subtotal + (subtotal > 499 ? 0 : 40)).toFixed(2))
        }
      }
    });
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
});

// POST /api/cart - add item to cart
router.post('/', async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'product_id is required' });
    }

    // check product exists and has stock
    const [[product]] = await db.query('SELECT * FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    // upsert: if already in cart, increment
    await db.query(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `, [DEFAULT_USER_ID, product_id, quantity]);

    res.json({ success: true, message: 'Added to cart' });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
});

// PATCH /api/cart/:cartItemId - update quantity
router.patch('/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const [result] = await db.query(
      `UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?`,
      [quantity, cartItemId, DEFAULT_USER_ID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    res.json({ success: true, message: 'Quantity updated' });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
});

// DELETE /api/cart/:cartItemId - remove item
router.delete('/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const [result] = await db.query(
      `DELETE FROM cart_items WHERE id = ? AND user_id = ?`,
      [cartItemId, DEFAULT_USER_ID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ success: false, message: 'Failed to remove item' });
  }
});

// DELETE /api/cart - clear entire cart
router.delete('/', async (req, res) => {
  try {
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [DEFAULT_USER_ID]);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
});

module.exports = router;
