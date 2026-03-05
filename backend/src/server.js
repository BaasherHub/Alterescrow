const app = require("./app");
const config = require("./config");
const pool = require("./db/pool");

const server = app.listen(config.port, () => {
  console.log(`Backend listening on ${config.port}`);
});

function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
