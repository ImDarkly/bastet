const path = require("path");

module.exports = {
  PORT: process.env.PORT || 8080,
  STATE_FILE: path.join(__dirname, "state.json"),
  DECAY_INTERVAL_MS: 30_000,
  DECAY_AMOUNT: 1,
  FEED_HUNGER_DELTA: 20,
  FEED_HAPPINESS_DELTA: 5,
  PLAY_HAPPINESS_DELTA: 20,
  PLAY_HUNGER_DELTA: 5,
};
