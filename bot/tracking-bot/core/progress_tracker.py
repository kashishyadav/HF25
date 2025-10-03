from models.task import Task

class ProgressTracker:
    def __init__(self, tasks: list[Task]):
        self.tasks = tasks

    def update_progress(self, issues, commits):
        for task in self.tasks:
            task_status = "Not started"

            for issue in issues:
                if task.title.lower() in issue.title.lower():
                    task_status = "In progress" if issue.state == "open" else "Completed"

            for commit in commits:
                if task.title.lower() in commit.commit.message.lower():
                    task_status = "Completed"

            task.status = task_status
        return self.tasks
