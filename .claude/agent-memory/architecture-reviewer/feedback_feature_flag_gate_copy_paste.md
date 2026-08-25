---
name: feature-flag-gate-copy-paste
description: Before flagging a hasFeature(FLAG) gate on a new action as a copy-paste mistake, get positive evidence the BE route is NOT actually gated — absence of client-side FEATURE_NOT_AVAILABLE handling is not that evidence
metadata:
  type: feedback
---

**Corrected after LNS-692.** My original instinct — "a new action reusing a sibling component's
existing `hasFeature(FLAG)` call, with no `FEATURE_NOT_AVAILABLE` handling anywhere in the new
endpoint's usecase/repo/service chain, is probably a copy-paste mistake that silently strips the
action" — is not a valid inference on its own, and was WRONG in the case that produced it.

**Why it was wrong**: some BE routes gate a feature with a plain `403 FORBIDDEN`, not a distinct
error code — so a client having no code-specific handler is the EXPECTED shape for a correctly
gated route, not evidence the gate is absent. On LNS-692 the retry-failed-postings endpoint was
verified (ticket text + independently-checked merged OpenAPI at the release branch) to be gated on
`MANAGERIAL_COSTING` server-side, reachable only by `OWNER`/`INTERNAL`, and an explicit AC required
the FE to never offer an action the server would refuse. Ungating the button — my recommended fix —
would have broken that AC.

**The corrected rule**: a finding that would REMOVE a client-side gate needs positive evidence the
server-side restriction is not real (the route's declared feature gate in the ticket, the merged
OpenAPI, or BE source — see [[project_openapi_deployment_check]] for how to fetch it) — not merely
the absence of a code-specific handler on the client. Before flagging a `hasFeature(FLAG)` gate as
spuriously copy-pasted:
1. Check the ticket/spec for an explicit "Feature gate: X" statement.
2. Check the merged BE OpenAPI (or BE source on the relevant release branch) for the route's
   declared gate.
3. Only flag if BOTH are silent on any restriction AND the flag is demonstrably describing a
   semantically unrelated capability (e.g., literally imported from an unrelated feature file with
   no shared rationale in either the ticket or the commit message).

**What DOES remain worth checking, and was the one part of this finding that held up**: whether
the FE's literal flag string (e.g. `"managerial_costing"`) actually matches what the BE puts in
`account.features[]`. A gate can be conceptually correct and still be dead code for everyone if the
string doesn't match — that's a distinct, narrower check (string equality against the BE contract)
from "is this gate real at all", and is legitimate to flag/verify independently.

This was independently raised by a second reviewer on the same faulty reasoning — treat it as a
reliable trap, not a one-off. See [[project_lns692_review_learnings]] for the full incident.
