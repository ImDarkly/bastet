const {
  FEED_HUNGER_DELTA,
  FEED_HAPPINESS_DELTA,
  PLAY_HUNGER_DELTA,
  PLAY_HAPPINESS_DELTA,
} = require("./config");

const state = {
  hunger: 50,
  happiness: 50,
  last_updated: new Date().toISOString(),
};

function feed() {
  state.hunger = Math.min(100, state.hunger + FEED_HUNGER_DELTA);
  state.happiness = Math.min(100, state.happiness + FEED_HAPPINESS_DELTA);
}

function play() {
  state.happiness = Math.min(100, state.happiness + PLAY_HAPPINESS_DELTA);
  state.hunger = Math.min(100, state.hunger + PLAY_HUNGER_DELTA);
}

module.exports = { state, feed, play };
