#!/usr/bin/env python3
"""Create or update changelog.md from git commits grouped by date."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from collections import OrderedDict
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

DATE_HEADING_RE = re.compile(r"^##\s+(\d{4}-\d{2}-\d{2})\s*$")
COMMIT_MARKER_RE = re.compile(r"\(commit:\s*([0-9a-f]{7,40})\)", re.IGNORECASE)


@dataclass(frozen=True)
class Commit:
    date: str
    full_hash: str
    short_hash: str
    subject: str

    @property
    def bullet(self) -> str:
        return f"- {self.subject} (commit: {self.short_hash})"


def _run_git_log(repo_root: Path) -> list[Commit]:
    safe_directory = repo_root.as_posix()
    command = [
        "git",
        "-c",
        f"safe.directory={safe_directory}",
        "-C",
        str(repo_root),
        "log",
        "--date=short",
        "--pretty=format:%ad|%H|%s",
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=False, encoding="utf-8")
    if result.returncode != 0:
        message = result.stderr.strip() or "failed to read git log"
        raise RuntimeError(message)

    commits: list[Commit] = []
    for raw_line in result.stdout.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        parts = line.split("|", 2)
        if len(parts) != 3:
            continue
        date, full_hash, subject = parts
        commits.append(
            Commit(
                date=date.strip(),
                full_hash=full_hash.strip().lower(),
                short_hash=full_hash.strip().lower()[:7],
                subject=(subject.strip() or "(no commit subject)"),
            )
        )
    return commits


def _parse_sections(text: str) -> OrderedDict[str, list[str]]:
    sections: OrderedDict[str, list[str]] = OrderedDict()
    current_date: str | None = None
    buffer: list[str] = []

    for line in text.splitlines():
        heading_match = DATE_HEADING_RE.match(line)
        if heading_match:
            if current_date is not None:
                sections[current_date] = _trim_blank_lines(buffer)
            current_date = heading_match.group(1)
            buffer = []
            continue
        if current_date is not None:
            buffer.append(line)

    if current_date is not None:
        sections[current_date] = _trim_blank_lines(buffer)
    return sections


def _trim_blank_lines(lines: list[str]) -> list[str]:
    trimmed = list(lines)
    while trimmed and not trimmed[0].strip():
        trimmed.pop(0)
    while trimmed and not trimmed[-1].strip():
        trimmed.pop()
    return trimmed


def _collect_logged_hashes(sections: Iterable[list[str]]) -> set[str]:
    hashes: set[str] = set()
    for lines in sections:
        for line in lines:
            match = COMMIT_MARKER_RE.search(line)
            if match:
                hashes.add(match.group(1).lower())
    return hashes


def _hash_is_logged(full_hash: str, logged_hashes: set[str]) -> bool:
    return any(full_hash.startswith(existing) for existing in logged_hashes)


def _group_by_date(commits: list[Commit]) -> OrderedDict[str, list[Commit]]:
    grouped: OrderedDict[str, list[Commit]] = OrderedDict()
    for commit in commits:
        grouped.setdefault(commit.date, []).append(commit)
    return grouped


def _render_changelog(sections: OrderedDict[str, list[str]]) -> str:
    output: list[str] = ["# Changelog", ""]
    for date in sorted(sections.keys(), reverse=True):
        output.append(f"## {date}")
        if sections[date]:
            output.extend(sections[date])
        else:
            output.append("- No entries recorded.")
        output.append("")
    return "\n".join(output).rstrip() + "\n"


def _resolve_changelog_path(repo_root: Path, changelog: str) -> Path:
    changelog_path = Path(changelog)
    if not changelog_path.is_absolute():
        changelog_path = repo_root / changelog_path
    return changelog_path.resolve()


def update_changelog(repo_root: Path, changelog_path: Path, dry_run: bool) -> int:
    commits = _run_git_log(repo_root)

    changelog_exists = changelog_path.exists()
    if changelog_exists:
        existing_text = changelog_path.read_text(encoding="utf-8")
        sections = _parse_sections(existing_text)
        logged_hashes = _collect_logged_hashes(sections.values())
    else:
        sections = OrderedDict()
        logged_hashes = set()

    if changelog_exists:
        commits_to_add = [c for c in commits if not _hash_is_logged(c.full_hash, logged_hashes)]
    else:
        commits_to_add = commits

    if changelog_exists and not commits_to_add:
        print(f"No new commits to append. {changelog_path} is up to date.")
        return 0

    grouped_new_commits = _group_by_date(commits_to_add)

    for date, items in grouped_new_commits.items():
        section = sections.get(date, [])
        for commit in items:
            bullet = commit.bullet
            if bullet not in section:
                section.append(bullet)
        sections[date] = section

    if not sections:
        print("No commits found. Changelog not updated.", file=sys.stderr)
        return 1

    rendered = _render_changelog(sections)

    action = "Would update" if dry_run else ("Updated" if changelog_exists else "Created")
    print(f"{action} {changelog_path}")
    print(f"Added {len(commits_to_add)} commit bullet(s) across {len(grouped_new_commits)} date(s).")

    if dry_run:
        print("\n--- changelog preview ---\n")
        print(rendered)
        return 0

    changelog_path.write_text(rendered, encoding="utf-8")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Create or update changelog.md from git history.")
    parser.add_argument(
        "--repo-root",
        default=".",
        help="Repository root path (default: current directory).",
    )
    parser.add_argument(
        "--changelog",
        default="changelog.md",
        help="Relative or absolute changelog path (default: changelog.md in repo root).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing files.",
    )
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    changelog_path = _resolve_changelog_path(repo_root, args.changelog)

    try:
        return update_changelog(repo_root=repo_root, changelog_path=changelog_path, dry_run=args.dry_run)
    except RuntimeError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
