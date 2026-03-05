const router = require("express").Router();
const c = require("../controllers/wallet.controller");
const { requireAuth } = require("../middlewares/auth");
router.post("/", requireAuth, c.createWallet);
router.get("/me", requireAuth, c.getMyWallet);
module.exports = router;
