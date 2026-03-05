const router = require("express").Router();
const c = require("../controllers/admin.controller");
const { requireAuth } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/admin");
router.get("/disputes", requireAuth, requireAdmin, c.listDisputes);
router.post("/disputes/:tradeId/resolve", requireAuth, requireAdmin, c.resolveDispute);
router.get("/users", requireAuth, requireAdmin, c.listUsers);
module.exports = router;
