require("dotenv").config();

const frontendUrl = process.env.FRONTEND_URL || "";
const corsOrigins = (process.env.CORS_ORIGINS || frontendUrl)
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

module.exports = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminEmail: (process.env.ADMIN_EMAIL || "").toLowerCase(),
  custodyTreasuryAddress: process.env.CUSTODY_TREASURY_ADDRESS || "",
  corsOrigins,
};
