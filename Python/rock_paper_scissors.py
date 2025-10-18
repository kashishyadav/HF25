# rps.py
import random

OPTIONS = ["rock", "paper", "scissors"]

def winner(user, comp):
    if user == comp:
        return "tie"
    wins = {
        "rock": "scissors",
        "scissors": "paper",
        "paper": "rock"
    }
    return "user" if wins[user] == comp else "comp"

def play():
    print("Rock   Paper  Scissors")
    while True:
        user = input("Choose rock, paper or scissors (or 'q' to quit): ").strip().lower()
        if user == 'q':
            break
        if user not in OPTIONS:
            print("Invalid choice — try again.")
            continue
        comp = random.choice(OPTIONS)
        print(f"Computer chose: {comp}")
        result = winner(user, comp)
        if result == "tie":
            print("It's a tie!")
        elif result == "user":
            print("You win! 🎉")
        else:
            print("Computer wins. 😅")
        print()

if __name__ == "__main__":
    play()
