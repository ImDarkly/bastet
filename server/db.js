const { Pool } = require("pg");
const { DATABASE_URL } = require("./config");

const pool = new Pool({ connectionString: DATABASE_URL });

async function load() {
  const { rows } = await pool.query("SELECT * FROM pet_state WHERE id = 1");
  return rows[0];
}

async function save(state) {
  await pool.query(
    `UPDATE pet_state
     SET hunger = $1, happiness = $2, last_updated = $3
     WHERE id = 1`,
    [state.hunger, state.happiness, new Date().toISOString()],
  );
}

module.exports = { load, save };
