import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.query('SELECT NOW()')
  .then(res => console.log('DB Connected:', res.rows))
  .catch(err => console.error('DB Error:', err));
