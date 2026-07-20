---
name: defer-memory-writes-to-reflection
description: Don't write durable agent-memory during a work phase (Phase 1 intake/scoping/verification); defer ALL durable memory writes to the Phase 10 reflection gate
metadata:
  type: feedback
---

Do NOT write durable agent-memory (new memory files, `MEMORY.md` edits, or project-memory updates) during a `/work-on-issue` work phase — Phase 1 intake, scoping, verification, the In-Review move, etc. Defer ALL durable memory writes to the Phase 10 reflection step, which is gated behind explicit reflection triage.

**Why:** LNS-414 (2026-06-26) — I wrote `project_accounting_params_independence.md` and edited `MEMORY.md` during Phase 1 intake. Persisting learnings is Phase 10's job; writing durable memory mid-run is out-of-process and risks committing premature or unvetted learnings before the reflection gate has triaged them. Distinct from operating-principle #8 (which governs *within-turn ordering* — deliverable before memory): this governs *which phase* may write durable memory at all.

**How to apply:** During intake/scoping/verification, hold learnings in working context, not in durable files. Scope-reconciliation facts discovered in Phase 1 belong in the PRD deliverable, not in agent-memory, until reflection. Only at the Phase 10 reflection step — after the orchestrator requests reflection — propose, and once approved write, durable memory. Related: [[accounting-params-independence]].
