from models.task import Task

class ReportGenerator:
    def __init__(self, tasks: list[Task]):
        self.tasks = tasks

    def display(self):
        print("\n📊 Project Progress Report\n")
        for task in self.tasks:
            print(f"- {task.title} → {task.status}")
