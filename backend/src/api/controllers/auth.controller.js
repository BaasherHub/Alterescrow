const authService = require("../../services/auth.service");
const { signToken } = require("../../utils/tokens");

async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    const user = await authService.register({ email, password });
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    return res.status(201).json({ user, token });
  } catch (err) { return res.status(400).json({ error: err.message }); }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    const user = await authService.login({ email, password });
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    return res.json({ user, token });
  } catch (err) { return res.status(401).json({ error: err.message }); }
}

module.exports = { register, login };
