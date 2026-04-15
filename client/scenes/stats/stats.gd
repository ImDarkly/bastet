extends Node

signal stats_changed(hunger: float, happiness: float)

var hunger: float = 0.0
var happiness: float = 0.0

func set_stats(new_hunger: float, new_happiness: float) -> void:
	hunger = clamp(new_hunger, 0.0, 100.0)
	happiness = clamp(new_happiness, 0.0, 100.0)
	stats_changed.emit(hunger, happiness)
