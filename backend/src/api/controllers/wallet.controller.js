const walletService = require("../../services/wallet.service");

async function createWallet(req, res) {
  try { return res.status(201).json({ wallet: await walletService.ensureWallet(req.user.sub) }); }
  catch (err) { return res.status(400).json({ error: err.message }); }
}

async function getMyWallet(req, res) {
  try { return res.json({ wallet: await walletService.getWallet(req.user.sub) }); }
  catch (err) { return res.status(400).json({ error: err.message }); }
}

module.exports = { createWallet, getMyWallet };
