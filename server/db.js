const { Pool } = require("pg");
const { DATABASE_URL } = require("./config");

const pool = new Pool({ connectionString: DATABASE_URL });

async function load() {
  const { rows } = await pool.query("SELECT * FROM pet_state WHERE id = 1");
  return rows[0];
}

async function save(state) {
  await pool.query(
    `INSERT INTO pet_state (id, hunger, happiness, last_updated)
     VALUES (1, $1, $2, $3)
     ON CONFLICT (id) DO UPDATE
     SET hunger = EXCLUDED.hunger,
         happiness = EXCLUDED.happiness,
         last_updated = EXCLUDED.last_updated`,
    [state.hunger, state.happiness, new Date().toISOString()],
  );
}

module.exports = { load, save };
