const express = require('express');
const router = express.Router();
const db = require('../config/db');

const DEFAULT_USER_ID = 1;

// GET /api/users/me - default user info
router.get('/me', async (req, res) => {
  try {
    const [[user]] = await db.query(
      `SELECT id, name, email, address, phone, created_at FROM users WHERE id = ?`,
      [DEFAULT_USER_ID]
    );
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'User fetch failed' });
  }
});

// GET /api/users/wishlist
router.get('/wishlist', async (req, res) => {
  try {
    const [items] = await db.query(`
      SELECT 
        w.id as wishlist_id,
        w.added_at,
        p.id as product_id,
        p.name, p.price, p.original_price, p.rating, p.review_count, p.is_prime,
        pi.image_url
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = true
      WHERE w.user_id = ?
    `, [DEFAULT_USER_ID]);

    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
});

// POST /api/users/wishlist - toggle wishlist
router.post('/wishlist', async (req, res) => {
  try {
    const { product_id } = req.body;

    // check if already in wishlist
    const [[existing]] = await db.query(
      `SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?`,
      [DEFAULT_USER_ID, product_id]
    );

    if (existing) {
      await db.query(
        `DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`,
        [DEFAULT_USER_ID, product_id]
      );
      return res.json({ success: true, action: 'removed', message: 'Removed from wishlist' });
    }

    await db.query(
      `INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)`,
      [DEFAULT_USER_ID, product_id]
    );
    res.json({ success: true, action: 'added', message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Wishlist operation failed' });
  }
});

module.exports = router;
