const pool = require("../db/pool");

async function createWithdrawal({ id, userId, token, amount, destination, status }) {
  const { rows } = await pool.query(
    `INSERT INTO withdrawals (id,user_id,token_address,amount,destination_address,status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [id, userId, token, amount, destination, status]
  );
  return rows[0];
}

async function listByUser(userId) {
  const { rows } = await pool.query(`SELECT * FROM withdrawals WHERE user_id=$1 ORDER BY created_at DESC`, [userId]);
  return rows;
}

module.exports = { createWithdrawal, listByUser };
