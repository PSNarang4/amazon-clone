const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
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