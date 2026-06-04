const { WebSocket } = require("ws");

const rooms = new Map();

function joinRoom(code, ws) {
  if (typeof code !== "string" || !code.trim()) {
    throw new TypeError("code must be a non-empty string");
  }
  if (!rooms.has(code)) rooms.set(code, new Set());
  rooms.get(code).add(ws);
}

function leaveRoom(code, ws) {
  if (typeof code !== "string" || !code.trim()) {
    throw new TypeError("code must be a non-empty string");
  }
  const room = rooms.get(code);
  if (room) {
    room.delete(ws);
    if (room.size === 0) rooms.delete(code);
  }
}

function broadcastToRoom(code, payload) {
  const room = rooms.get(code);
  if (!room) return;

  let msg;
  try {
    msg = JSON.stringify(payload);
  } catch (err) {
    console.error("Failed to serialize payload for room", code, err);
    return;
  }

  for (const client of room) {
    try {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    } catch (err) {
      console.error("Failed to send to client in room", code, err);
    }
  }
}

module.exports = { joinRoom, leaveRoom, broadcastToRoom };
