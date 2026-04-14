extends CanvasLayer

var hunger: float = 0.0
var happiness: float = 0.0

var ws_peer = WebSocketPeer.new()

const SERVER_URL = "ws://localhost:8080"

@onready var hunger_bar = $StatsBars/HungerBar
@onready var happiness_bar = $StatsBars/HappinessBar

@onready var hunger_button = $StatsButtons/HungerButton
@onready var happiness_button = $StatsButtons/HappinessButton

@onready var status_label = $StatusLabel

func _ready():
	update_bars()
	ws_peer.connect_to_url(SERVER_URL)
	status_label.text = "Connecting..."

func _process(delta: float) -> void:
	ws_peer.poll()
	
	var state = ws_peer.get_ready_state()
	
	if state == WebSocketPeer.STATE_OPEN:
		status_label.text = "Connected"
		
		while ws_peer.get_available_packet_count() > 0:
			var packet = ws_peer.get_packet()
			var text = packet.get_string_from_utf8()
			handle_server_message(text)
			
	elif state == WebSocketPeer.STATE_CLOSED:
		status_label.text = "Disconnected"


func handle_server_message(text: String):
	var data = JSON.parse_string(text)
	if data == null:
		return
	if data.get("type") != "state":
		return
	var state = data["state"]
	hunger = state["hunger"]
	happiness = state["happiness"]
	update_bars()

func _on_hunger_button_pressed() -> void:
	send_action("feed")


func _on_happiness_button_pressed() -> void:
	send_action("play")


func send_action(action: String):
	if ws_peer.get_ready_state() != WebSocketPeer.STATE_OPEN:
		return
	
	ws_peer.send_text(JSON.stringify({ "type": "action", "action": action }))


func update_bars():
	hunger_bar.value = clamp(hunger, 0.0, 100.0)
	happiness_bar.value = clamp(happiness, 0.0, 100.0)
