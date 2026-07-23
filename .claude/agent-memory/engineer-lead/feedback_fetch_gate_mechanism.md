---
name: fetch-gate-mechanism
description: When planning a validity-gated fetch, name the exact disabling mechanism — a provider flag never suppresses the request
metadata:
  type: feedback
---

When a plan gates a fetch on input validity ("don't fetch when the range is invalid"), it MUST name the exact mechanism that disables the request at the fetch layer. For SWR that is a **null key** (`enabled ? [key] : null`). A provider-derived `shouldFetch`/`rangeError` boolean only governs what renders — it does NOT stop an unconditional `useSWR`/`useSWRMutation` from firing. Forcing `shellState="success"` with `report=null` to hide the resulting error just masks it into a blank panel.

Corollary: do not add a "don't modify layer X" constraint (e.g. "don't touch the hooks") when X is the only place the required behavior can live. That forces a known-incomplete implementation in the wrong layer and guarantees a re-loop. Either widen scope to modify that layer, or flag the freeze as the open risk.

**Why:** On LNS-374 the plan said "set shouldFetch=false" + "don't modify hooks"; the hooks fetched unconditionally, so an invalid range still 400'd and rendered a blank panel (`rangeError` was computed but the gate lived in the wrong layer). Surfaced as a MAJOR finding + iterate cycle; the fix was the SWR null-key in the hook.

**How to apply:** When planning any validity- or selection-gated fetch, verify the target hook already gates via a null key (the software-engineer lane captures this as [[swr-conditional-enabled]]) or explicitly include the hook change in scope. Never plan a render-only flag as a fetch suppressor.
