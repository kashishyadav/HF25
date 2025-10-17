# guess_the_number.py
import random

def play():
    print("🎯 Guess the Number")
    print("Choose difficulty: (1) Easy (2) Medium (3) Hard")
    diff = input("Enter 1, 2 or 3: ").strip()
    if diff == "1":
        low, high, attempts = 1, 20, 7
    elif diff == "3":
        low, high, attempts = 1, 200, 10
    else:
        low, high, attempts = 1, 50, 8

    secret = random.randint(low, high)
    print(f"\nI'm thinking of a number between {low} and {high}.")
    print(f"You have {attempts} attempts. Good luck!\n")

    for turn in range(1, attempts + 1):
        try:
            guess = int(input(f"Attempt {turn}/{attempts} — your guess: "))
        except ValueError:
            print("Please enter a valid integer.")
            continue

        if guess == secret:
            print(f"🎉 Correct! You guessed it in {turn} attempts.")
            break
        elif guess < secret:
            print("Too low.")
        else:
            print("Too high.")
    else:
        print(f"😅 Out of attempts. The number was {secret}.")

if __name__ == "__main__":
    while True:
        play()
        again = input("\nPlay again? (y/n): ").strip().lower()
        if again != "y":
            print("Bye! 👋")
            break
