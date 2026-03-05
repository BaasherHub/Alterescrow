const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./api/routes/auth.routes");
const walletRoutes = require("./api/routes/wallet.routes");
const tradeRoutes = require("./api/routes/trade.routes");
const withdrawalRoutes = require("./api/routes/withdrawal.routes");
const adminRoutes = require("./api/routes/admin.routes");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.status(200).json({ ok: true, service: "backend" }));
app.get("/api/v1", (_req, res) => res.json({ message: "AlterEscrow backend online" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wallets", walletRoutes);
app.use("/api/v1/trades", tradeRoutes);
app.use("/api/v1/withdrawals", withdrawalRoutes);
app.use("/api/v1/admin", adminRoutes);

module.exports = app;
