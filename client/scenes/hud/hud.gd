extends CanvasLayer

var hunger: float = 70.0
var happiness: float = 55.0

@onready var hunger_bar = $StatsBars/HungerBar
@onready var happiness_bar = $StatsBars/HappinessBar

func _ready():
	hunger_bar.value = hunger
	happiness_bar.value = happiness
