const tradeService = require("../../services/trade.service");

async function createTrade(req, res) {
  try {
    const { buyerId, token, amount, fiatAmount, fiatCurrency, paymentMethod } = req.body;
    if (!buyerId || !token || !amount || !fiatAmount || !fiatCurrency || !paymentMethod) return res.status(400).json({ error: "Missing required trade fields" });
    const trade = await tradeService.createTrade({ sellerId: req.user.sub, buyerId, token, amount, fiatAmount, fiatCurrency, paymentMethod });
    return res.status(201).json({ trade });
  } catch (err) { return res.status(400).json({ error: err.message }); }
}

async function listMyTrades(req, res) {
  try { return res.json({ trades: await tradeService.listTrades(req.user.sub) }); }
  catch (err) { return res.status(400).json({ error: err.message }); }
}

async function markPaid(req, res) {
  try { return res.json({ trade: await tradeService.markPaid(req.params.tradeId, req.user.sub) }); }
  catch (err) { return res.status(400).json({ error: err.message }); }
}

async function openDispute(req, res) {
  try { return res.json({ trade: await tradeService.openDispute(req.params.tradeId, req.user.sub, req.body.reason || "No reason provided") }); }
  catch (err) { return res.status(400).json({ error: err.message }); }
}

async function release(req, res) {
  try { return res.json({ trade: await tradeService.releaseTrade(req.params.tradeId, req.user.sub) }); }
  catch (err) { return res.status(400).json({ error: err.message }); }
}

module.exports = { createTrade, listMyTrades, markPaid, openDispute, release };
