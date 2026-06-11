---
name: project-linear-quota-blocked
description: Linear workspace `loonas` hit free-tier issue limit 2026-05-19; cleared by 2026-05-21 — issue creation working again
metadata:
  type: project
---

**Fact**: On 2026-05-19, the `loonas` Linear workspace returned `Usage limit exceeded - You've exceeded the free issue limit for this workspace` on every `save_issue` create call. Reads still worked.

**Cleared 2026-05-21**: `save_issue` create succeeded again (LNS-219 created during LNS-197 Phase 8 work-on-issue closeout). Either workspace was upgraded or quota was bumped. Not 100% sure of the trigger — just observed it works.

**How to apply**:
- Default to trying `save_issue` creates as normal.
- If a 429-style "Usage limit exceeded" error returns again, fall back to inline spec in the final report so the user can paste manually, and re-test after a confirmed upgrade.
- Updates to existing issues (passing `id`) were never blocked and remain safe.

Related: [[project-unofest]] (current project consuming most tickets), [[reference-fe-requested-be-label]].
