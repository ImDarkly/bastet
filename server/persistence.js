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
  const tmp = STATE_FILE + ".tmp";
  try {
    fs.writeFileSync(tmp, JSON.stringify(state));
    fs.renameSync(tmp, STATE_FILE);
  } catch (err) {
    try {
      fs.unlinkSync(tmp);
    } catch {}
    throw err;
  }
}

module.exports = { load, save };
