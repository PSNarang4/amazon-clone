const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'amazon_clone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// quick test on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('DB connected successfully');
    conn.release();
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
})();

module.exports = pool;
