const { DECAY_AMOUNT, DECAY_INTERVAL_MS } = require("./config");

function applyDecay(state, ticks) {
  state.hunger = Math.max(0, state.hunger - DECAY_AMOUNT * ticks);
  state.happiness = Math.max(0, state.happiness - DECAY_AMOUNT * ticks);
}

function catchUp(state) {
  const elapsedMs = Date.now() - new Date(state.last_updated).getTime();
  const missedTicks = Math.floor(elapsedMs / DECAY_INTERVAL_MS);
  if (missedTicks > 0) {
    applyDecay(state, missedTicks);
    state.last_updated = new Date().toISOString();
    console.log(`Catch-up: applied ${missedTicks} decay tick(s)`);
  }
}

function decay(state) {
  applyDecay(state, 1);
  state.last_updated = new Date().toISOString();
}

module.exports = { catchUp, decay };
