const { WebSocketServer, WebSocket } = require("ws");
const http = require("http");
const { PORT, DECAY_INTERVAL_MS } = require("./config");
const { state, feed, play } = require("./petState");
const { decay, catchUp } = require("./decay");
const { load, save } = require("./db");

const actions = new Map([
  ["feed", feed],
  ["play", play],
]);

function broadcast(wss, payload) {
  const msg = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  }
}

const server = http.createServer();
const wss = new WebSocketServer({ server });

async function start() {
  const saved = await load();
  Object.assign(state, saved);
  catchUp(state);

  server.listen(PORT);
  console.log(`Server listening on ${PORT}`);
}

setInterval(async () => {
  decay(state);
  state.last_updated = new Date().toISOString();
  await save(state);
  broadcast(wss, { type: "state", state });
}, DECAY_INTERVAL_MS);

wss.on("connection", (ws) => {
  console.log("Client connected — sending current state");

  ws.send(JSON.stringify({ type: "state", state }));

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      return;
    }

    if (msg.type !== "action") {
      ws.send(
        JSON.stringify({ type: "error", message: `Unknown type: ${msg.type}` }),
      );
      return;
    }

    const handler = actions.get(msg.action);
    if (!handler) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: `Unknown action: ${msg.action}`,
        }),
      );
      return;
    }

    handler();
    console.log(`Action "${msg.action}" → state:`, state);
    broadcast(wss, { type: "state", state });
  });

  ws.on("close", () => console.log("Client disconnected"));
  ws.on("error", (err) => console.error("WebSocket error:", err.message));
});

start();
