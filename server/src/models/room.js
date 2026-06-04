const { WebSocket } = require("ws");

const rooms = new Map();

function joinRoom(code, ws) {
  if (!rooms.has(code)) rooms.set(code, new Set());
  rooms.get(code).add(ws);
}

function leaveRoom(code, ws) {
  const room = rooms.get(code);
  if (room) {
    room.delete(ws);
    if (room.size === 0) rooms.delete(code);
  }
}

function broadcastToRoom(code, payload) {
  const room = rooms.get(code);
  if (!room) return;
  const msg = JSON.stringify(payload);
  for (const client of room) {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  }
}

module.exports = { joinRoom, leaveRoom, broadcastToRoom };
