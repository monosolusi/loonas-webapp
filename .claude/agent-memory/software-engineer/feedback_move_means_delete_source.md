---
name: move-means-delete-source
description: When a plan says "move/relocate" files, the done-condition includes deleting the source — duplicate-and-keep leaves dead files; verify the old dir is empty except intended files and nothing imports the old path
metadata:
  type: feedback
---

When a plan says **"move"** or **"relocate"** a file/tree, the completion condition is: (a) the new location has the files, (b) the **old location is deleted** except explicitly-retained files (e.g. a redirect `page.tsx`), and (c) `git status` shows **deletions**, not only additions. Copy-and-keep silently leaves dead, unreferenced code.

**Why:** LNS-117 — the `coa-mappings` tree was "moved" to `chart-of-accounts/mappings/` by duplicating + keeping the originals, leaving **10 orphaned files** under the old path (caught by QA + architecture-review as a fix-loop item).

**How to apply:** After any relocation, `grep -rn "<old-path>" src/` to confirm nothing imports the old location, and `ls` the old directory to confirm only intended files remain. Related: [[verify-computed-state-consumed]].
