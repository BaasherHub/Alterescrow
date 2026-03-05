const { v4: uuid } = require("uuid");
const repo = require("../repositories/trade.repo");

async function createTrade({ sellerId, buyerId, token, amount, fiatAmount, fiatCurrency, paymentMethod }) {
  return repo.createTrade({ id: uuid(), sellerId, buyerId, token, amount, fiatAmount, fiatCurrency, paymentMethod, status: "OPEN" });
}

async function listTrades(userId) { return repo.listByUser(userId); }

async function markPaid(id, buyerId) {
  const trade = await repo.findById(id);
  if (!trade) throw new Error("Trade not found");
  if (trade.buyer_id !== buyerId) throw new Error("Only buyer can mark paid");
  if (trade.status !== "OPEN") throw new Error("Trade is not open");
  return repo.updateStatus({ id, status: "PAID", paidAt: new Date().toISOString() });
}

async function openDispute(id, userId, reason) {
  const trade = await repo.findById(id);
  if (!trade) throw new Error("Trade not found");
  if (![trade.seller_id, trade.buyer_id].includes(userId)) throw new Error("Not participant");
  if (trade.status !== "PAID") throw new Error("Can only dispute paid trades");
  await repo.updateStatus({ id, status: "DISPUTED" });
  await repo.createOrUpdateDispute({ id: uuid(), tradeId: id, openedBy: userId, reason });
  return repo.findById(id);
}

async function releaseTrade(id, sellerId) {
  const trade = await repo.findById(id);
  if (!trade) throw new Error("Trade not found");
  if (trade.seller_id !== sellerId) throw new Error("Only seller can release");
  if (!["PAID", "DISPUTED"].includes(trade.status)) throw new Error("Cannot release in current status");
  return repo.updateStatus({ id, status: "COMPLETED", completedAt: new Date().toISOString() });
}

async function resolveDispute(id, winnerId, adminId) {
  const trade = await repo.findById(id);
  if (!trade) throw new Error("Trade not found");
  if (trade.status !== "DISPUTED") throw new Error("Trade not disputed");
  if (![trade.seller_id, trade.buyer_id].includes(winnerId)) throw new Error("Winner must be participant");
  await repo.resolveDispute({ tradeId: id, winnerId, adminId });
  return repo.updateStatus({ id, status: "RESOLVED", completedAt: new Date().toISOString() });
}

async function listDisputes() { return repo.listDisputes(); }

module.exports = { createTrade, listTrades, markPaid, openDispute, releaseTrade, resolveDispute, listDisputes };
