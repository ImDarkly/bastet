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
  if (!family) {
    ws.send(JSON.stringify({ type: "error", message: "Family not found" }));
    return;
  }

  const state = {
    hunger: Math.max(
      0,
      Math.min(100, parseFloat(family.hunger) + deltas.hunger),
    ),
    happiness: Math.max(
      0,
      Math.min(100, parseFloat(family.happiness) + deltas.happiness),
    ),
  };

  const updated = await saveFamilyState(code, state.hunger, state.happiness);
  if (!updated) {
    ws.send(JSON.stringify({ type: "error", message: "Family not found" }));
    return;
  }
  broadcastToRoom(code, { type: "state", state: updated });
}

module.exports = { handleAction };
