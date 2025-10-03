import argparse
from openai import OpenAI

from core.document_parser import DocumentParser
from core.task_extractor import TaskExtractor
from core.repo_connector import RepoConnector
from core.progress_tracker import ProgressTracker
from core.report_generator import ReportGenerator


def main():
    parser = argparse.ArgumentParser(description="Agentic AI Project Tracker")
    parser.add_argument("--doc", required=True, help="Path to project document (PDF)")
    parser.add_argument("--repo", required=True, help="GitHub repo (e.g., user/repo)")
    parser.add_argument("--token", required=True, help="GitHub Personal Access Token")
    parser.add_argument("--openai-key", required=True, help="OpenAI API Key")
    args = parser.parse_args()

    client = OpenAI(api_key=args.openai_key)

    # Step 1: Parse document
    doc_parser = DocumentParser(args.doc)
    chunks = doc_parser.parse()

    # Step 2: Extract tasks (for now from first chunk)
    task_extractor = TaskExtractor(client)
    tasks = task_extractor.extract(chunks[0].page_content)
    if not tasks:
        print("❌ No tasks extracted.")
        return

    # Step 3: GitHub repo data
    repo = RepoConnector(args.token, args.repo)
    issues = repo.get_issues()
    commits = repo.get_commits()
    print(f"COMMITS: {commits}")

    # Step 4: Track progress
    tracker = ProgressTracker(tasks)
    updated_tasks = tracker.update_progress(issues, commits)

    # Step 5: Report
    reporter = ReportGenerator(updated_tasks)
    reporter.display()


if __name__ == "__main__":
    main()
