const state = {
  hunger: 50,
  happiness: 50,
  last_updated: new Date().toISOString(),
};

function feed() {
  state.hunger = Math.min(100, state.hunger + 20);
  state.happiness = Math.min(100, state.happiness + 5);
  state.last_updated = new Date().toISOString();
}

function play() {
  state.happiness = Math.min(100, state.happiness + 20);
  state.hunger = Math.min(100, state.hunger + 5);
  state.last_updated = new Date().toISOString();
}

module.exports = { state, feed, play };
