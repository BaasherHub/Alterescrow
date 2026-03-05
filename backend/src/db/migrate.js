const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, "../../db/schema.sql"), "utf8");
  await pool.query(sql);
  console.log("Migration applied");
  await pool.end();
}

run().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
