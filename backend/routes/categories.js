const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query(`SELECT * FROM categories ORDER BY name`);
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

module.exports = router;
