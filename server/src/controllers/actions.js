const { getFamily, saveFamilyState } = require("../db/db");
const { broadcastToRoom } = require("../models/room");

const DELTAS = {
  feed: { hunger: 20, happiness: 5 },
  play: { hunger: 5, happiness: 20 },
};

async function handleAction(ws, code, action) {
  const deltas = DELTAS[action];
  if (!deltas) {
    ws.send(
      JSON.stringify({ type: "error", message: `Unknown action: ${action}` }),
    );
    return;
  }

  const family = await getFamily(code);
  if (!family) return;

  const state = {
    hunger: Math.min(100, parseFloat(family.hunger) + deltas.hunger),
    happiness: Math.min(100, parseFloat(family.happiness) + deltas.happiness),
  };

  await saveFamilyState(code, state.hunger, state.happiness);
  broadcastToRoom(code, { type: "state", state });
}

module.exports = { handleAction };
