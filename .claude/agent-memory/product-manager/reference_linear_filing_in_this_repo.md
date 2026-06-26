---
name: linear-filing-in-this-repo
description: In loonas-webapp-2, the /linear-* issue-creation skills do NOT exist; file Linear issues directly via save_issue with reconciled team+labels; canonical label names
metadata:
  type: reference
---

In **loonas-webapp-2** the agent-instruction-referenced issue-creation skills (`/linear-techdebt`, `/linear-create-issue`, `/linear-bug`) are **NOT present** in `.claude/skills/`. The only Linear-related skill here is `work-on-issue`. So when asked to "use the /linear-techdebt skill" (etc.), do NOT invoke a non-existent skill — **file directly via `mcp__plugin_linear_linear__save_issue`** with team + labels reconciled by hand (which is what the skill would have encoded anyway). The standing rule still holds: every PM issue carries `Frontend`; add `fe-requested-be` only for not-yet-existing BE work.

**Canonical Loonas workspace label names (verified 2026-06-26, exact casing matters for `save_issue.labels`):**
- Scope/technical-domain: `Frontend`, `Backend`, `Mobile`, `Infra`.
- Scope modifiers: **`Tech Debt`** (NOT `tech-debt`; desc "Long-term cost we'd avoid in greenfield — refactor or cleanup"), `Breaking Change`, `Product`, `Spike`, `Chore`, `Refactor`, `Improvement`, `Feature`, `Bug`.
- Domain: `accounting`, `coa`, `safety`, `auth`.
- Handoff: `fe-requested-be` (pair w/ Backend), `be-requested-fe` (pair w/ Frontend), `epic`.

**Loonas team workflow states (verified 2026-06-26):** Backlog, Todo, In Progress (`541fa7d0-432f-4795-803a-2d5736734bd6`), In Review, Done, Canceled, Duplicate. Resolve via `list_issue_statuses` — IDs can drift.

Example: LNS-412 (CloseWarningModel tech-debt) filed via `save_issue` team Loonas, labels `Frontend`+`accounting`+`Tech Debt`, relatedTo LNS-407. See [[reference-linear-accounting-fe-batch]], [[linear-write-permission-gate]].
