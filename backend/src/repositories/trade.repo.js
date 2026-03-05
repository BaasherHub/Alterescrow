const pool = require("../db/pool");

async function createTrade(t) {
  const { rows } = await pool.query(
    `INSERT INTO trades (id,seller_id,buyer_id,token_address,amount,fiat_amount,fiat_currency,payment_method,status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [t.id, t.sellerId, t.buyerId, t.token, t.amount, t.fiatAmount, t.fiatCurrency, t.paymentMethod, t.status]
  );
  return rows[0];
}

async function listByUser(userId) {
  const { rows } = await pool.query(`SELECT * FROM trades WHERE seller_id=$1 OR buyer_id=$1 ORDER BY created_at DESC`, [userId]);
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(`SELECT * FROM trades WHERE id=$1 LIMIT 1`, [id]);
  return rows[0] || null;
}

async function updateStatus({ id, status, paidAt = null, completedAt = null }) {
  const { rows } = await pool.query(
    `UPDATE trades SET status=$2, paid_at=COALESCE($3,paid_at), completed_at=COALESCE($4,completed_at), updated_at=NOW() WHERE id=$1 RETURNING *`,
    [id, status, paidAt, completedAt]
  );
  return rows[0] || null;
}

async function createOrUpdateDispute({ id, tradeId, openedBy, reason }) {
  const { rows } = await pool.query(
    `INSERT INTO disputes (id,trade_id,opened_by,reason,status) VALUES ($1,$2,$3,$4,'OPEN')
     ON CONFLICT (trade_id) DO UPDATE SET opened_by=EXCLUDED.opened_by, reason=EXCLUDED.reason, status='OPEN'
     RETURNING *`,
    [id, tradeId, openedBy, reason]
  );
  return rows[0];
}

async function listDisputes() {
  const { rows } = await pool.query(`SELECT * FROM disputes ORDER BY created_at DESC`);
  return rows;
}

async function resolveDispute({ tradeId, winnerId, adminId }) {
  const { rows } = await pool.query(
    `UPDATE disputes SET status='RESOLVED', winner_id=$2, resolved_by=$3, resolved_at=NOW() WHERE trade_id=$1 RETURNING *`,
    [tradeId, winnerId, adminId]
  );
  return rows[0] || null;
}

module.exports = { createTrade, listByUser, findById, updateStatus, createOrUpdateDispute, listDisputes, resolveDispute };
