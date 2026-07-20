---
name: stale-ticket-reconcile-blocker
description: When a ticket cites a blocker that has since RESOLVED, treat the ticket body as potentially stale — reconcile the contract against the blocker's resolution chain + live OpenAPI before writing the PRD, and enumerate the deltas explicitly
metadata:
  type: feedback
---

**Rule:** When a ticket's body references a blocker that is now Done/closed, treat the body as potentially STALE. Before writing the PRD, reconcile the contract against (a) the blocker's resolution chain — the *implementing* ticket(s), not just the clarification ticket — and (b) the live OpenAPI spec. Then enumerate every delta explicitly in a "Contract corrections" PRD section so downstream (EL/SWE) builds on the corrected contract, not the stale ticket text.

**Why:** On 2026-06-15 (LNS-369) the ticket body predated LNS-382's JWT-only remount. Reconciling against the resolved blocker (LNS-366 → LNS-382 impl + LNS-384 FE migration) and the live spec caught 6 contract deltas (JWT-only paths/no `{accountId}`, `posting_date` not `date`, no `reference_*` in create body, split `change_reason_category`+`change_reason_detail` not `reason`, single-get IS `{data}`-wrapped, new audit fields). Speccing from the ticket text alone would have shipped a wrong contract; the correction propagated through EL/SWE with zero contract rework. Note: the canonical answer was NOT in the clarification ticket (LNS-366 was Done with an empty body + no comments) — it lived in the implementing tickets.

**How to apply:** Any ticket whose body references a now-resolved blocker — re-read the blocker's full resolution chain to the implementing ticket(s), re-fetch the live OpenAPI, diff both against the ticket body, and surface the deltas in a "Contract corrections" section of the PRD.

Related: [[jwt-only-tenant-resolution]], [[journal-write-contract]]
