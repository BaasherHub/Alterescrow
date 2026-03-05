const authService = require("../../services/auth.service");
const tradeService = require("../../services/trade.service");

async function listDisputes(_req, res) {
  try { return res.json({ disputes: await tradeService.listDisputes() }); }
  catch (err) { return res.status(400).json({ error: err.message }); }
}

async function resolveDispute(req, res) {
  try { return res.json({ trade: await tradeService.resolveDispute(req.params.tradeId, req.body.winnerId, req.user.sub) }); }
  catch (err) { return res.status(400).json({ error: err.message }); }
}

async function listUsers(_req, res) {
  try {
    const users = await authService.listUsers();
    return res.json({ users: users.map((u) => ({ id: u.id, email: u.email, role: u.role })) });
  } catch (err) { return res.status(400).json({ error: err.message }); }
}

module.exports = { listDisputes, resolveDispute, listUsers };
