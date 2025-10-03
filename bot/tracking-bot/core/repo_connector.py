from github import Github

class RepoConnector:
    def __init__(self, token: str, repo_name: str):
        self.github = Github(token)
        self.repo = self.github.get_repo(repo_name)

    def get_issues(self):
        return list(self.repo.get_issues(state="all"))

    def get_commits(self, limit=50):
        return list(self.repo.get_commits()[:limit])
