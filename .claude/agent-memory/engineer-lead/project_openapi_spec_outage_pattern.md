---
name: openapi-spec-outage-pattern
description: dev-api.loonas.id OpenAPI spec endpoint has gone down across multiple validation windows in LNS-227 (Phase 2 504, Phase 7 502) — plan for FE-code-only fallback
metadata:
  type: project
---

`https://dev-api.loonas.id/openapi.json` has been **unreachable across two separate LNS-227 validation windows** (Phase 2: 3× HTTP 504 timeout; Phase 7: 3× HTTP 502 from nginx/1.31.0). It's not a transient blip — it's a recurring infra weakness on the docs/spec service that blocks live contract verification.

**Why:** Two consecutive failures, days apart, on the same endpoint suggest the OpenAPI docs service is either oversubscribed, behind an unhealthy upstream, or running on infra that doesn't get the same uptime treatment as the API itself. We do not have visibility into BE infra to diagnose further.

**How to apply:**
- Don't burn a long retry loop. After 3 retries (WebFetch or curl), declare the spec unreachable and pivot to FE-code-grounded review.
- The FE service layer (`features/**/data/sources/*.ts` + `data/models/*.ts`) is the authoritative source for *what FE sends* and *what FE parses*. It cannot tell you what BE *accepts* or *returns* — but for PRs that don't change the contract surface, it's enough to confirm no FE-side drift.
- When emitting the Phase 7 verdict under outage, the correct verdict is **⚠️ CANNOT VALIDATE** (not ❌ blocking, not ✅ green) plus an advisory to proceed if the PR doesn't introduce new BE-touched surfaces.
- Flag the recurring outage to PM/orchestrator as a tech-debt follow-up — BE team should know their spec service is unhealthy across observed validation windows.
- See [[openapi-webfetch-truncation]] for the orthogonal WebFetch truncation issue: even when the spec IS reachable, prefer curl + parse over trusting the WebFetch summary.
