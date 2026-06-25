---
name: el-plan-overrides-ui-spec
description: When the EL implementation plan and an earlier UID/UI spec conflict, the EL plan is the later authoritative decision — implement the EL plan, never silently ship the superseded UI-spec detail
metadata:
  type: feedback
---

**Rule:** The EL implementation plan is produced AFTER the UI spec and reconciles it against the real BE contract + blessed decisions. When the two conflict, the EL plan wins. Implement the EL plan's version; never silently ship the superseded UI-spec detail. If the conflict is genuinely ambiguous, flag it in your report rather than guessing.

**Why:** LNS-347 — the UID spec originally defined a "Margin Tipis"/low_margin STATUS tier, but PM + UID explicitly DROPPED it in Phase 3 (no BE threshold to back it) and the EL plan recorded it as dropped. I implemented the tier anyway with a client-computed `marginPct < 10` threshold — following the older UI-spec design over the EL plan's override. It became a fix-loop item (and compounded a no-client-calc violation).

**How to apply:** Before implementing any behaviour, cross-check the EL plan against the UI spec for the same surface; where they differ, treat the EL plan as authoritative and the UI-spec line as stale. At report time, call out any place you chose one input over a conflicting other. Related: [[spec-copy-verbatim]], [[no-fe-calc-for-be-owned-money]].
