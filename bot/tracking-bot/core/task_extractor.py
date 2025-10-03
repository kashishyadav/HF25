from models.task import Task

class TaskExtractor:
    def __init__(self, client=None):
        self.client = client  # client is optional now

    def extract(self, text: str):
        # MOCK TASKS FOR TESTING
        return [
            Task(id="1", title="Update README.md", description="Update the README file"),
            Task(id="2", title="Implement User Authentication", description="Add login system"),
            Task(id="3", title="Setup Database (Postgres)", description="Setup Postgres DB"),
            Task(id="4", title="Add Payment Integration", description="Integrate payment gateway")
        ]
