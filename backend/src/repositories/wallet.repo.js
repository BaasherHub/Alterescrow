const pool = require("../db/pool");

async function findByUserId(userId) {
  const { rows } = await pool.query(`SELECT * FROM wallets WHERE user_id = $1 LIMIT 1`, [userId]);
  return rows[0] || null;
}

async function createWallet({ id, userId, chain, address }) {
  const { rows } = await pool.query(
    `INSERT INTO wallets (id, user_id, chain, address) VALUES ($1,$2,$3,$4) RETURNING *`,
    [id, userId, chain, address]
  );
  return rows[0];
}

module.exports = { findByUserId, createWallet };
