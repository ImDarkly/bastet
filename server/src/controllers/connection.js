const {
  createFamily,
  joinFamily,
  getFamily,
  saveFamilyState,
} = require("../db/db");
const { joinRoom, leaveRoom } = require("../models/room");
const { generateCode } = require("../models/familyCode");
const { catchUp } = require("../models/decay");
const { handleAction } = require("./actions");

const socketFamily = new Map();

async function handleMessage(ws, raw) {
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch {
    ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
    return;
  }

  if (msg.type === "create") return _handleCreate(ws);
  if (msg.type === "join") return _handleJoin(ws, msg.code);
  if (msg.type === "action") return _handleAction(ws, msg.action);

  ws.send(
    JSON.stringify({ type: "error", message: `Unknown type: ${msg.type}` }),
  );
}

function handleClose(ws) {
  const code = socketFamily.get(ws);
  if (code) leaveRoom(code, ws);
  socketFamily.delete(ws);
}

function getActiveCodes() {
  return new Set(socketFamily.values());
}

async function _handleCreate(ws) {
  let code, family;
  for (let i = 0; i < 5; i++) {
    code = generateCode();
    try {
      family = await createFamily(code);
      break;
    } catch {
      /* PK collision, retry */
    }
  }
  if (!family) {
    ws.send(
      JSON.stringify({ type: "error", message: "Could not generate code" }),
    );
    return;
  }

  socketFamily.set(ws, code);
  joinRoom(code, ws);
  ws.send(JSON.stringify({ type: "created", code, state: _toState(family) }));
}

async function _handleJoin(ws, rawCode) {
  const code = (rawCode ?? "").toUpperCase();
  const isReconnect = socketFamily.get(ws) === code;

  const family = isReconnect ? await getFamily(code) : await joinFamily(code);
  if (!family) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Family not found or already full",
      }),
    );
    return;
  }

  const state = _toState(family);

  if (!isReconnect) {
    socketFamily.set(ws, code);
    joinRoom(code, ws);
  }

  ws.send(JSON.stringify({ type: "joined", code, state }));
}

async function _handleAction(ws, action) {
  const code = socketFamily.get(ws);
  if (!code) {
    ws.send(JSON.stringify({ type: "error", message: "Not in a family" }));
    return;
  }
  await handleAction(ws, code, action);
}

function _toState(family) {
  return {
    hunger: parseFloat(family.hunger),
    happiness: parseFloat(family.happiness),
    last_updated: family.last_updated,
  };
}

module.exports = { handleMessage, handleClose, getActiveCodes };
