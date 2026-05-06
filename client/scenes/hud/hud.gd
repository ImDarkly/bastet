extends Control

var hunger: float = 0.0
var happiness: float = 0.0


@onready var hunger_bar = $StatsBars/HungerBar
@onready var happiness_bar = $StatsBars/HappinessBar
@onready var status_label = $StatusLabel

func _ready():
	$StatsButtons/HungerButton.text    = Strings.BTN_FEED
	$StatsButtons/HappinessButton.text = Strings.BTN_PLAY
	Stats.stats_changed.connect(_on_stats_changed)
	_on_stats_changed(Stats.hunger, Stats.happiness)
	status_label.text = Strings.STATUS_CONNECTING

func _process(delta: float) -> void:
	if Network.get_ready_state() == WebSocketPeer.STATE_OPEN:
		status_label.text = Strings.STATUS_CONNECTED
	elif Network.get_ready_state() == WebSocketPeer.STATE_CLOSED:
		status_label.text = Strings.STATUS_DISCONNECTED

func _on_stats_changed(hunger: float, happiness: float) -> void:
	hunger_bar.value = hunger
	happiness_bar.value = happiness


func _on_hunger_button_pressed() -> void:
	Network.send_action("feed")


func _on_happiness_button_pressed() -> void:
	Network.send_action("play")
