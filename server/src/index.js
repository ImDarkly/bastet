const http = require("http");
const { WebSocketServer } = require("ws");
const { PORT, DECAY_INTERVAL_MS } = require("../../config");
const {
  handleMessage,
  handleClose,
  getActiveCodes,
} = require("./controllers/connection");
const { getFamily, saveFamilyState } = require("./db/db");
const { broadcastToRoom } = require("./models/room");
const { decay } = require("./models/decay");

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", (raw) => handleMessage(ws, raw));
  ws.on("close", () => handleClose(ws));
  ws.on("error", (err) => console.error("WebSocket error:", err.message));
});

setInterval(async () => {
  for (const code of getActiveCodes()) {
    try {
      const family = await getFamily(code);
      if (!family) continue;
      const state = {
        hunger: parseFloat(family.hunger),
        happiness: parseFloat(family.happiness),
      };
      decay(state);
      const updated = await saveFamilyState(
        code,
        state.hunger,
        state.happiness,
      );
      if (!updated) {
        console.warn(`Could not broadcast state for family ${code}`);
        continue;
      }
      broadcastToRoom(code, {
        type: "state",
        state: {
          hunger: updated.hunger,
          happiness: updated.happiness,
          last_updated: updated.last_updated,
        },
      });
    } catch (err) {
      console.error("Decay error for", code, err);
    }
  }
}, DECAY_INTERVAL_MS);

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
