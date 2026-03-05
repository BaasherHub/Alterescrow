const router = require("express").Router();
const c = require("../controllers/trade.controller");
const { requireAuth } = require("../middlewares/auth");
router.post("/", requireAuth, c.createTrade);
router.get("/", requireAuth, c.listMyTrades);
router.post("/:tradeId/mark-paid", requireAuth, c.markPaid);
router.post("/:tradeId/dispute", requireAuth, c.openDispute);
router.post("/:tradeId/release", requireAuth, c.release);
module.exports = router;
