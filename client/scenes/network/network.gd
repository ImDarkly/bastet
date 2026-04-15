extends Node

const SERVER_URL = "ws://localhost:8080"

var ws_peer = WebSocketPeer.new()

func _ready() -> void:
	ws_peer.connect_to_url(SERVER_URL)

func _process(delta: float) -> void:
	ws_peer.poll()

	if ws_peer.get_ready_state() == WebSocketPeer.STATE_OPEN:
		while ws_peer.get_available_packet_count() > 0:
			var text = ws_peer.get_packet().get_string_from_utf8()
			_handle_message(text)

func _handle_message(text: String) -> void:
	var data = JSON.parse_string(text)
	if data == null or data.get("type") != "state":
		return
	var state = data.get("state")
	if state == null or not state.has("hunger") or not state.has("happiness"):
		return
	Stats.set_stats(float(state["hunger"]), float(state["happiness"]))

func send_action(action: String) -> void:
	if ws_peer.get_ready_state() != WebSocketPeer.STATE_OPEN:
		return
	ws_peer.send_text(JSON.stringify({"type": "action", "action": action}))

func get_ready_state() -> int:
	return ws_peer.get_ready_state()
