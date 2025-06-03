const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DB_URL);

(async () => {
  try {
    await sql`SELECT 1`; // Simple query
    console.log('Connected to Neon database successfully.');
  } catch (err) {
    console.error('Failed to connect to the Neon database:', err);
  }
})();

module.exports = sql;
