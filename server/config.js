require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 8080,
  DATABASE_URL: process.env.DATABASE_URL,
  DECAY_INTERVAL_MS: 30_000,
  DECAY_AMOUNT: 1,
  FEED_HUNGER_DELTA: 20,
  FEED_HAPPINESS_DELTA: 5,
  PLAY_HAPPINESS_DELTA: 20,
  PLAY_HUNGER_DELTA: 5,
};
