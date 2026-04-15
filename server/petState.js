const fs = require("fs");
const {
  FEED_HUNGER_DELTA,
  FEED_HAPPINESS_DELTA,
  PLAY_HAPPINESS_DELTA,
  PLAY_HUNGER_DELTA,
} = require("./config");
const { load, save } = require("./persistence");
const { catchUp } = require("./decay");

const state = load();
catchUp(state);

function feed() {
  state.hunger = Math.min(100, state.hunger + 20);
  state.happiness = Math.min(100, state.happiness + 5);
  state.last_updated = new Date().toISOString();
  save(state);
}

function play() {
  state.happiness = Math.min(100, state.happiness + 20);
  state.hunger = Math.min(100, state.hunger + 5);
  state.last_updated = new Date().toISOString();
  save(state);
}

module.exports = { state, feed, play };
