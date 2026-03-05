const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const userRepo = require("../repositories/user.repo");

async function register({ email, password, role = "user" }) {
  const normalized = email.toLowerCase();
  const existing = await userRepo.findByEmail(normalized);
  if (existing) throw new Error("Email already registered");
  const passwordHash = await bcrypt.hash(password, 10);
  return userRepo.createUser({ id: uuid(), email: normalized, passwordHash, role });
}

async function login({ email, password }) {
  const user = await userRepo.findByEmail(email.toLowerCase());
  if (!user) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error("Invalid credentials");
  return { id: user.id, email: user.email, role: user.role };
}

async function listUsers() {
  return userRepo.listUsers();
}

module.exports = { register, login, listUsers };
