const pool = require("../db/pool");

async function findByUserId(userId) {
  const { rows } = await pool.query(`SELECT * FROM wallets WHERE user_id = $1 LIMIT 1`, [userId]);
  return rows[0] || null;
}

async function createWallet({ id, userId, chain, custodyAccountId, walletType, treasuryAddress, kmsKeyRef }) {
  const { rows } = await pool.query(
    `INSERT INTO wallets (id, user_id, chain, custody_account_id, wallet_type, treasury_address, kms_key_ref, ledger_available, ledger_locked)
     VALUES ($1,$2,$3,$4,$5,$6,$7,0,0)
     RETURNING *`,
    [id, userId, chain, custodyAccountId, walletType, treasuryAddress || null, kmsKeyRef || null]
  );
  return rows[0];
}

module.exports = { findByUserId, createWallet };
