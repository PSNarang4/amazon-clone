const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/products - list all with filters
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = true
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }

    // sorting options
    if (sort === 'price_asc') query += ` ORDER BY p.price ASC`;
    else if (sort === 'price_desc') query += ` ORDER BY p.price DESC`;
    else if (sort === 'rating') query += ` ORDER BY p.rating DESC`;
    else if (sort === 'newest') query += ` ORDER BY p.created_at DESC`;
    else query += ` ORDER BY p.review_count DESC`; // default: popular

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [products] = await db.query(query, params);

    // get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
    const countParams = [];
    if (search) {
      countQuery += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
      const s = `%${search}%`;
      countParams.push(s, s, s);
    }
    if (category) {
      countQuery += ` AND c.slug = ?`;
      countParams.push(category);
    }

    const [[{ total }]] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Products fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - single product with all images + specs
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [[product]] = await db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // fetch all images
    const [images] = await db.query(
      `SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order`,
      [id]
    );

    // fetch specs
    const [specs] = await db.query(
      `SELECT spec_key, spec_value FROM product_specs WHERE product_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: { ...product, images, specs }
    });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

module.exports = router;
