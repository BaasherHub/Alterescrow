const { v4: uuid } = require("uuid");
const walletRepo = require("../repositories/wallet.repo");
const config = require("../config");

function makeCustodyAccountId() {
  return `acct_${uuid().replace(/-/g, "").slice(0, 24)}`;
}

function mapWallet(row) {
  return {
    id: row.id,
    userId: row.user_id,
    chain: row.chain,
    walletType: row.wallet_type,
    custodyAccountId: row.custody_account_id,
    treasuryAddress: row.treasury_address,
    kmsKeyRef: row.kms_key_ref,
    ledgerAvailable: row.ledger_available,
    ledgerLocked: row.ledger_locked,
    createdAt: row.created_at,
  };
}

async function ensureWallet(userId) {
  const existing = await walletRepo.findByUserId(userId);
  if (existing) return mapWallet(existing);

  const created = await walletRepo.createWallet({
    id: uuid(),
    userId,
    chain: "BSC",
    custodyAccountId: makeCustodyAccountId(),
    walletType: "CUSTODIAL",
    treasuryAddress: config.custodyTreasuryAddress,
    kmsKeyRef: process.env.KMS_KEY_ID || "",
  });

  return mapWallet(created);
}

async function getWallet(userId) {
  return ensureWallet(userId);
}

module.exports = { ensureWallet, getWallet };
