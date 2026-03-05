const pool = require("../db/pool");

async function createUser({ id, email, passwordHash, role }) {
  const { rows } = await pool.query(
    `INSERT INTO users (id, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id,email,role`,
    [id, email, passwordHash, role]
  );
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);
  return rows[0] || null;
}

async function listUsers() {
  const { rows } = await pool.query(`SELECT id,email,role,created_at FROM users ORDER BY created_at DESC`);
  return rows;
}

module.exports = { createUser, findByEmail, listUsers };
