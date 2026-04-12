extends CanvasLayer

var hunger: float = 0.0
var happiness: float = 0.0

const DECAY_RATE: float = 1.0 / 30.0

@onready var hunger_bar = $StatsBars/HungerBar
@onready var happiness_bar = $StatsBars/HappinessBar

@onready var hunger_button = $StatsButtons/HungerButton
@onready var happiness_button = $StatsButtons/HappinessButton

func _ready():
	update_bars()


func _process(delta: float) -> void:
	hunger = clamp(hunger  - DECAY_RATE * delta, 0.0, 100.0)
	happiness = clamp(happiness - DECAY_RATE * delta, 0.0, 100.0)
	update_bars()

func _on_hunger_button_pressed() -> void:
	hunger = clamp(hunger + 10.0, 0.0, 100.0)
	update_bars()


func _on_happiness_button_pressed() -> void:
	happiness = clamp(happiness + 10.0, 0.0, 100.0)
	update_bars()


func update_bars():
	hunger_bar.value = clamp(hunger, 0.0, 100.0)
	happiness_bar.value = clamp(happiness, 0.0, 100.0)
