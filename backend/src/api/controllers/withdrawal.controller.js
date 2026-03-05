const withdrawalService = require("../../services/withdrawal.service");

async function requestWithdrawal(req, res) {
  try {
    const { token, amount, destination } = req.body;
    if (!token || !amount || !destination) return res.status(400).json({ error: "Missing fields" });
    return res.status(201).json({ withdrawal: await withdrawalService.requestWithdrawal({ userId: req.user.sub, token, amount, destination }) });
  } catch (err) { return res.status(400).json({ error: err.message }); }
}

async function listMine(req, res) {
  try { return res.json({ withdrawals: await withdrawalService.listWithdrawals(req.user.sub) }); }
  catch (err) { return res.status(400).json({ error: err.message }); }
}

module.exports = { requestWithdrawal, listMine };
