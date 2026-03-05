const { v4: uuid } = require("uuid");
const walletRepo = require("../repositories/wallet.repo");

async function ensureWallet(userId) {
  const existing = await walletRepo.findByUserId(userId);
  if (existing) return existing;
  return walletRepo.createWallet({ id: uuid(), userId, chain: "BSC", address: `0x${uuid().replace(/-/g, "").slice(0, 40)}` });
}

async function getWallet(userId) {
  return ensureWallet(userId);
}

module.exports = { ensureWallet, getWallet };
