const { WebSocketServer, WebSocket } = require("ws");
const http = require("http");
const { state, feed, play } = require("./petState");

const petState = state;

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
const PORT = process.env.PORT || 8080;
server.listen(PORT);

console.log(`Server listening on ${PORT}`);

wss.on("connection", (ws) => {
  console.log("Client connected — sending current state");

  ws.send(JSON.stringify({ type: "state", state: petState }));

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
    console.log(`Action "${msg.action}" → state:`, petState);
    broadcast(wss, { type: "state", state: petState });
  });

  ws.on("close", () => console.log("Client disconnected"));
  ws.on("error", (err) => console.error("WebSocket error:", err.message));
});
