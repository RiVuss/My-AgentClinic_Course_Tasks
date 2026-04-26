---
name: changelog-maintainer
description: Keep a repository-root changelog.md grouped by date headings. Use when initializing a changelog from git history, or when updating changelog entries before merge so commits are captured under `## YYYY-MM-DD` sections.
---

# Changelog Maintainer

Maintain `changelog.md` in the repository root with date headings and commit bullets.

## Workflow

1. Run the updater script from the repository root:
   `python skills/changelog-maintainer/scripts/update_changelog.py`
2. Review `changelog.md` for wording and ordering.
3. Edit any bullet text manually when commit subjects are too vague.
4. Stage `changelog.md` with the rest of the merge-ready changes.

## What The Script Does

- If `changelog.md` does not exist:
  - Read `git log`
  - Create `# Changelog`
  - Add date sections as `## YYYY-MM-DD`
  - Add one bullet per commit:
    `- <commit subject> (commit: <short_sha>)`
- If `changelog.md` already exists:
  - Read existing `(commit: <sha>)` markers
  - Add only commits that are not already logged
  - Append new entries under the matching date section
  - Create the date section when needed

## Commands

- Standard run:
  `python skills/changelog-maintainer/scripts/update_changelog.py`
- Dry run preview (no file changes):
  `python skills/changelog-maintainer/scripts/update_changelog.py --dry-run`
- Custom target file:
  `python skills/changelog-maintainer/scripts/update_changelog.py --changelog CHANGELOG.md`

## Before Merge Checklist

1. Run the updater script.
2. Verify there are no duplicate bullets for the same commit.
3. Confirm today has an entry when branch commits were added today.
