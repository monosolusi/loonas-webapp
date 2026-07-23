---
name: feedback-linear-write-permission-gate
description: During /work-on-issue, PM's Linear state-move + comment writes (on issues not created in the session) get intercepted by the harness permission classifier — security warning on the pickup move, hard block on the In-Review move — until the user explicitly authorizes; orchestrator should authorize Linear writes up front
metadata:
  type: feedback
---

**Rule:** In `/work-on-issue`, PM's Linear writes against an issue that was **not created in the current session** (the "In Progress" pickup move in Phase 1, and the "In Review" move + summary comment in Phase 9) are treated by the harness permission classifier as unauthorized external-system writes. Expect a post-hoc **security warning** at minimum, and a **hard pre-dispatch block** at worst. The orchestrator should anticipate this and obtain explicit user authorization for the Linear writes up front, rather than discovering the block mid-run.

**Why:** On 2026-06-25 during LNS-409 (FE tech-debt: centralize journal SWR keys), the Phase 1 "Todo → In Progress" move went through but emitted a `[External System Writes]` security warning. The Phase 9 "In Progress → In Review" move + reviewer comment was **hard-denied by the auto-mode classifier before the sub-agent could even run** — reason: the issue was "not created this session" and the `/work-on-issue` invocation "did not explicitly authorize publishing to or modifying this external issue." The orchestrator had to pause, ask the user via AskUserQuestion, get an explicit "yes — move + comment", and re-dispatch PM with the authorization stated in the brief before the writes succeeded. This is a recurring `/work-on-issue` friction, not a one-off: the classifier does not infer authorization from the slash-command invocation alone.

**How to apply:**

1. **Orchestrator, not PM, resolves the gate.** PM cannot self-authorize an external write. When a Linear write is denied, PM should surface the denial precisely (what it tried, why it's needed) and STOP — do not retry verbatim, do not attempt a workaround. The orchestrator then asks the user for explicit authorization.
2. **Authorize up front when possible.** Because both the pickup move and the In-Review move are predictable steps of every `/work-on-issue` run, the orchestrator can batch authorization early (e.g., confirm at intake that Linear state moves + comments are approved for this issue) to avoid a mid-run stall right before the PR handoff.
3. **Re-dispatch carries the authorization.** After the user approves, the re-dispatch brief to PM must state "the user has explicitly authorized (a) the state move and (b) the comment" so the classifier and the sub-agent both have the basis to proceed.
4. **Order still matters.** Authorization does not change the Phase-9 ordering rule: the "In Review" move must land **after** the PR opens and **last** (comment before state-move), because GitHub's PR-open integration auto-maps the issue back to "In Progress" and would clobber an earlier move.

Related: [[project-linear-quota-blocked]] (a different Linear write-blocker — quota, not permissions), [[feedback-proactive-be-gap-ticket]] (other Phase-9/Phase-7 PM Linear obligations).
