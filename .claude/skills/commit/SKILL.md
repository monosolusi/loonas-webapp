---
name: commit
description: Commit and push code changes
disable-model-invocation: true
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Read, Grep, Glob
argument-hint: [optional commit message]
---

# Commit and Push Changes

Current branch:
!`git branch --show-current`

Changed files:
!`git status --short`

Diff:
!`git diff`

Recent commits:
!`git log --oneline -5`

## Instructions

1. **Analyze changes**: Review the diff above and understand what was changed and why.
2. **Stage files**: Add only relevant changed files by name. Do NOT use `git add -A` or `git add .` — stage specific files to avoid accidentally committing secrets or unrelated files.
3. **Craft commit message**: Follow the Conventional Commits style matching the repo's existing history (e.g., `feat(scope): description`, `fix(scope): description`, `chore(scope): description`). If the user provided a message via `$ARGUMENTS`, use that instead.
4. **Commit**: Create the commit. Always append `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` to the message. Use a HEREDOC to pass the message:
   ```
   git commit -m "$(cat <<'EOF'
   type(scope): message

   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```
5. **Push**: Push to the remote tracking branch. If no upstream is set, push with `-u origin <branch>`.
6. **Verify**: Run `git status` and `git log --oneline -1` to confirm success.

## Rules

- If there are no changes to commit, inform the user and stop.
- Do NOT commit files that may contain secrets (`.env`, `credentials.json`, etc.).
- If a pre-commit hook fails, fix the issue and create a NEW commit (do not amend).
- If the push fails, inform the user of the error and do not retry automatically.
