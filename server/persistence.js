const fs = require("fs");
const { STATE_FILE } = require("./config");

const defaults = {
  hunger: 50,
  happiness: 50,
  last_updated: new Date().toISOString(),
};

function load() {
  try {
    const raw = fs.readFileSync(STATE_FILE, "utf8");
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

function save(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

module.exports = { load, save };
