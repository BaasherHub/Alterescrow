const { v4: uuid } = require("uuid");
const repo = require("../repositories/withdrawal.repo");

async function requestWithdrawal({ userId, token, amount, destination }) {
  return repo.createWithdrawal({ id: uuid(), userId, token, amount, destination, status: "PENDING_REVIEW" });
}

async function listWithdrawals(userId) { return repo.listByUser(userId); }

module.exports = { requestWithdrawal, listWithdrawals };
