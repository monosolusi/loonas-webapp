---
name: linear-filing-in-this-repo
description: Linear filing mechanics for the Loonas team — /linear-* skills live in ~/.claude/skills (not the repo), canonical label names + workflow states, and the bare-LNS-nnn auto-link trap
metadata:
  type: reference
---

**The `/linear-*` issue-creation skills DO exist — they live in `~/.claude/skills/`, not the repo's `.claude/skills/`.** Verified 2026-07-30 by reading `~/.claude/skills/{linear-create-issue,linear-bug,linear-techdebt}/SKILL.md`. An earlier version of this memory wrongly recorded them as absent because only the repo directory was checked; checking the repo dir is **not** a check for skill availability.

Their house format is: `## Background / Problem / (Steps to Reproduce / Expected / Actual, bug only) / Proposed Solution / Acceptance Criteria / Notes / ## Repository`. Load-bearing rules they encode:
- **NEVER set `state`** — the user manages status, so new issues land in the team default (Backlog).
- **NEVER write dependency prose in the description** — use the `blockedBy` / `blocks` / `relatedTo` relation fields.
- Always include `## Repository` (`Frontend: loonas-webapp` / `Backend: loonas-api`; drop the irrelevant one).
- Their **defaults must be reconciled before the write**: `/linear-create-issue` defaults to team `Engineer` + label `Feature`; override team to **Loonas** and ensure `Frontend` is present.

Reading the SKILL.md and applying the format directly (rather than invoking the interactive flow) is fine and preferable when filing a **batch** of issues or when the user specifies their own section list — 14 sequential interactive invocations fight a caller-specified format. Filing via `save_issue` remains the mechanism either way.

**TRAP — a bare `LNS-nnn` in an issue body creates a REAL Linear relation.** Quoting an external source that cites a ticket id (e.g. an OpenAPI description saying "tracked in LNS-33") auto-links it into an actual `relatedTo` edge. On LNS-592 this wired a money-safety ticket to LNS-33, an unrelated closed VA/QRIS expiry fix, pointing engineers at the wrong ticket. Fix: wrap the identifier in a code span or paraphrase it, and `removeRelatedTo` if it already fired. **Always `get_issue(includeRelations)` after creating issues with relations** — it catches both this and genuine relation failures.

**TRAP — attaching issues auto-starts a project, and the start date cannot be un-set via MCP.** Adding issues to a new project flipped its status from Backlog to **In Progress** and stamped `startDate` + `startedAt`, with no explicit status write from me. `save_project(state: "Backlog")` reverts the status fine, but `save_project` types `startDate` as **string with no null option** (unlike `lead`, which documents "null to remove"), so a stale start date can only be cleared in the UI. Do not send `""` to force it — that is a placeholder on a live date field. After creating a project and attaching issues, re-check its status and report any residue you cannot fix rather than leaving it misrepresenting state.

**Canonical Loonas workspace label names (re-verified 2026-07-30, exact casing matters for `save_issue.labels`):**
- Scope/technical-domain: `Frontend`, `Backend`, `Mobile`, `Infra`.
- Scope modifiers: **`Tech Debt`** (NOT `tech-debt`), `Breaking Change`, `Product`, `Spike`, `Chore`, `Refactor`, `Improvement`, `Feature`, `Bug`.
- Domain: `accounting`, `coa`, `safety`, `auth`.
- Handoff: `fe-requested-be`, `be-requested-fe`, `epic`.

**Loonas team (`25774782-db4a-4209-b163-257ca0d9c4a4`) workflow states (re-verified 2026-07-30):** Backlog (`52ae478e-ba18-4147-8f4c-4018b505506f`), Todo, In Progress (`541fa7d0-432f-4795-803a-2d5736734bd6`), In Review (`67601d70-b798-4efa-b00c-9cc9edb83f4e`), Done, Canceled, Duplicate. Resolve via `list_issue_statuses` — IDs can drift.

See [[pos-offline-capability]], [[reference-linear-accounting-fe-batch]], [[linear-write-permission-gate]].
