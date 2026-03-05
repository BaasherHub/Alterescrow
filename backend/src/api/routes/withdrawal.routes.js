const router = require("express").Router();
const c = require("../controllers/withdrawal.controller");
const { requireAuth } = require("../middlewares/auth");
router.post("/", requireAuth, c.requestWithdrawal);
router.get("/", requireAuth, c.listMine);
module.exports = router;
