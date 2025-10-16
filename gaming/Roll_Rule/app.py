import random
import time

# Dice faces (ASCII art)
dice_faces = {
    1: ("┌─────┐",
        "│     │",
        "│  •  │",
        "│     │",
        "└─────┘"),
    2: ("┌─────┐",
        "│ •   │",
        "│     │",
        "│   • │",
        "└─────┘"),
    3: ("┌─────┐",
        "│ •   │",
        "│  •  │",
        "│   • │",
        "└─────┘"),
    4: ("┌─────┐",
        "│ • • │",
        "│     │",
        "│ • • │",
        "└─────┘"),
    5: ("┌─────┐",
        "│ • • │",
        "│  •  │",
        "│ • • │",
        "└─────┘"),
    6: ("┌─────┐",
        "│ • • │",
        "│ • • │",
        "│ • • │",
        "└─────┘")
}

def roll_dice():
    return random.randint(1, 6)

print("🎲 Welcome to the Two-Player Dice Game! 🎲")
time.sleep(1)

# Player 1 roll
input("\nPlayer 1, press Enter to roll the dice...")
p1 = roll_dice()
print("\nPlayer 1 rolled:")
for line in dice_faces[p1]:
    print(line)

# Player 2 roll
input("\nPlayer 2, press Enter to roll the dice...")
p2 = roll_dice()
print("\nPlayer 2 rolled:")
for line in dice_faces[p2]:
    print(line)

# Decide winner
print("\n🏆 Result:")
if p1 > p2:
    print("🎉 Player 1 Wins!")
elif p2 > p1:
    print("🎉 Player 2 Wins!")
else:
    print("🤝 It's a Tie!")
