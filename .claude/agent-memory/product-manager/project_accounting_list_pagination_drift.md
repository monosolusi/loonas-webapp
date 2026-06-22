---
name: accounting-list-pagination-drift
description: All accounting list FE services send page/limit; if BE is offset-based the drift is systemic, not just journals (LNS-386)
metadata:
  type: project
---

The accounting module's FE list services uniformly send `page`/`limit` query params and map a page-based `PaginationMeta` (`page`/`limit`/`total`/`total_pages`), via the shared `core/resources/paginated.ts` contract: `journal.ts`, `ledger-account.ts` (2 list methods), `coa-mapping.ts`, and `report.ts` (TB + GL list methods). LNS-386 flags the journal-list service as sending `page` while the BE journal-list is reported offset-based.

**Why:** If EL's live-OpenAPI verification confirms the BE accounting list endpoints are offset-based, the page-2-doesn't-advance defect is NOT isolated to journals — the same drift exists in the sibling services above. LNS-386 is deliberately scoped to journals only; the siblings are a separate follow-up.

**How to apply:** When scoping LNS-386 (or any accounting-list pagination ticket), do NOT widen scope to siblings without EL evidence. But once EL confirms the journal BE contract (offset vs page) and the response-meta shape, immediately judge whether to file a follow-up ticket auditing `ledger-account.ts` / `coa-mapping.ts` / `report.ts`. The WebFetch summarizer truncates this spec and gives contradictory pagination answers — the authoritative parse is EL's raw-spec read, per [[reconcile-stale-ticket-vs-resolved-blocker]] and the LNS-373 truncation lesson. The FE UI model stays page-based; any offset conversion lives only at the service boundary.
