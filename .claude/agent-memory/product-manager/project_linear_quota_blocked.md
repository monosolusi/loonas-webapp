---
name: project-linear-quota-blocked
description: Linear workspace `loonas` hit free-tier issue limit 2026-05-19; new issue creation via API blocked until upgrade
metadata:
  type: project
---

**Fact**: As of 2026-05-19, the `loonas` Linear workspace returns `Usage limit exceeded - You've exceeded the free issue limit for this workspace` on every `save_issue` create call. Reads (`list_issues`, `get_issue`, `list_issue_labels`) still work.

**Why**: Workspace is on Linear free plan; issue cap reached. Last successful creates were LNS-189 and LNS-190 on 2026-05-19 (BE dashboard deps for UNOFEST).

**How to apply**:
- Do NOT attempt new `save_issue` create calls until user confirms workspace is upgraded or quota cleared.
- For UNOFEST or any project that needs new tickets, deliver the full spec content inline in the final report so the user can paste manually, OR ask the user to upgrade first.
- Updates to existing issues (passing `id` to `save_issue`) may still work — try those before assuming full block.
- Re-test by attempting a single create after the user signals upgrade.

Related: [[project-unofest]] (current project needing tickets), [[reference-fe-requested-be-label]] (label is created and usable on existing tickets).
