const { Pool } = require("pg");
const { DATABASE_URL } = require("../../config");

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

async function createFamily(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new TypeError("code must be a non-empty string");
  }
  const trimmed = code.trim();
  const { rows } = await pool.query(
    `INSERT INTO families (code, hunger, happiness, last_updated, member_count)
     VALUES ($1, 50, 50, NOW(), 1)
     RETURNING *`,
    [trimmed],
  );
  return rows[0];
}

async function joinFamily(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new TypeError("code must be a non-empty string");
  }
  const trimmed = code.trim();
  const { rows } = await pool.query(
    `UPDATE families
     SET member_count = member_count + 1
     WHERE code = $1 AND member_count < 2
     RETURNING *`,
    [trimmed],
  );
  if (rows.length === 0) return null; // not found or full
  return rows[0];
}

async function getFamily(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new TypeError("code must be a non-empty string");
  }
  const trimmed = code.trim();
  const { rows } = await pool.query(`SELECT * FROM families WHERE code = $1`, [
    trimmed,
  ]);
  return rows[0] ?? null;
}

async function saveFamilyState(code, hunger, happiness) {
  if (typeof code !== "string" || !code.trim()) {
    throw new TypeError("code must be a non-empty string");
  }
  if (typeof hunger !== "number" || hunger < 0 || hunger > 100) {
    throw new TypeError("hunger must be a number between 0 and 100");
  }
  if (typeof happiness !== "number" || happiness < 0 || happiness > 100) {
    throw new TypeError("happiness must be a number between 0 and 100");
  }
  const trimmed = code.trim();
  const result = await pool.query(
    `UPDATE families
     SET hunger = $2, happiness = $3, last_updated = NOW()
     WHERE code = $1
     RETURNING hunger, happiness, last_updated`,
    [trimmed, hunger, happiness],
  );
  if (result.rowCount === 0) {
    console.warn(`Family with code "${trimmed}" not found during state save`);
    return null;
  }
  return result.rows[0];
}

module.exports = {
  load,
  save,
  createFamily,
  joinFamily,
  getFamily,
  saveFamilyState,
};
