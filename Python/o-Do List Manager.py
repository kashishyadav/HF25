# To-Do List Manager
# A simple command-line Python app to manage your daily tasks
# Perfect for intermediate-level open-source contribution

tasks = []

def show_menu():
    print("\n=== To-Do List Manager ===")
    print("1. View tasks")
    print("2. Add task")
    print("3. Remove task")
    print("4. Save tasks to file")
    print("5. Exit")

def view_tasks():
    if not tasks:
        print("No tasks yet!")
    else:
        print("\nYour Tasks:")
        for i, task in enumerate(tasks, 1):
            print(f"{i}. {task}")

def add_task():
    task = input("Enter a new task: ").strip()
    if task:
        tasks.append(task)
        print(f"✅ '{task}' added to the list.")
    else:
        print("Task cannot be empty!")

def remove_task():
    view_tasks()
    try:
        index = int(input("Enter the task number to remove: "))
        if 1 <= index <= len(tasks):
            removed = tasks.pop(index - 1)
            print(f"❌ '{removed}' removed.")
        else:
            print("Invalid task number!")
    except ValueError:
        print("Please enter a valid number!")

def save_tasks():
    with open("tasks.txt", "w") as f:
        for task in tasks:
            f.write(task + "\n")
    print("💾 Tasks saved to 'tasks.txt'")

# Main loop
while True:
    show_menu()
    choice = input("Enter your choice (1-5): ").strip()

    if choice == '1':
        view_tasks()
    elif choice == '2':
        add_task()
    elif choice == '3':
        remove_task()
    elif choice == '4':
        save_tasks()
    elif choice == '5':
        print("👋 Goodbye! Keep being productive.")
        break
    else:
        print("Invalid choice! Please try again.")
