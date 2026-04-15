extends CanvasLayer

var hunger: float = 0.0
var happiness: float = 0.0


@onready var hunger_bar = $StatsBars/HungerBar
@onready var happiness_bar = $StatsBars/HappinessBar
@onready var status_label = $StatusLabel

func _ready():
	Stats.stats_changed.connect(_on_stats_changed)
	status_label.text = "Connecting..."

func _process(delta: float) -> void:
	if Network.get_ready_state() == WebSocketPeer.STATE_OPEN:
		status_label.text = "Connected"
	elif Network.get_ready_state() == WebSocketPeer.STATE_CLOSED:
		status_label.text = "Disconnected"

func _on_stats_changed(hunger: float, happiness: float) -> void:
	hunger_bar.value = hunger
	happiness_bar.value = happiness


func _on_hunger_button_pressed() -> void:
	Network.send_action("feed")


func _on_happiness_button_pressed() -> void:
	Network.send_action("play")
