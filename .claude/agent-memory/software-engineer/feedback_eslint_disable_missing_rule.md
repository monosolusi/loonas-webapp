---
name: feedback-eslint-disable-missing-rule
description: Do not use eslint-disable comments for rules not configured in this project (e.g. react-hooks/exhaustive-deps)
metadata:
  type: feedback
---

Do not add `// eslint-disable-next-line react-hooks/exhaustive-deps` or similar disable comments for rules that are NOT in the project's ESLint config. This project does NOT have `react-hooks/exhaustive-deps` configured — adding a disable comment for it causes an ESLint error ("Definition for rule ... was not found").

**Why:** LNS-344 — adding the disable comment to `accumulated-deficit-block.tsx` caused a lint error on the first pass.

**How to apply:** Before adding any eslint-disable comment, verify the rule is actually enabled. In this project, use a stable `ref` approach for one-shot mount effects (store callback in `useRef`, use empty `[]` deps, no disable comment needed).
