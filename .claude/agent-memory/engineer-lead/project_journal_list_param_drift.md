---
name: journal-list-param-drift
description: GET /accounting/journals is offset-IN / page-OUT (asymmetric); FE sent page on request — LNS-386 fixes the request side only
metadata:
  type: project
---

`features/accounting/data/sources/journal.ts` `list()` historically sent `searchParams` `page`+`limit`+`search`. Live OpenAPI verified 2026-06-22 (LNS-386 contract lock, raw-spec parse) for `GET /accounting/journals` (operationId `listJournals`):

- **Request query is OFFSET-based**: `offset` (integer, min 0, default 0 — 0-based ROW offset, NOT page index), `limit` (integer, min 1, **max 100**, default 25 — FE's hardcoded 25 is legal), `search` (string, maxLength 255). There is NO `page` query param; BE silently ignored the FE's `page`, so page 2+ returned the page-1 slice.
- **Response `meta` is PAGE-shaped**: shared `PaginationMeta` component = `page`/`limit`/`total`/`total_pages` (snake). So request and response use DIFFERENT pagination vocabularies — this is the one trap. The existing meta map (`meta.page/limit/total/total_pages` → `PaginationMeta`) is already correct and needs NO change.
- **Sibling asymmetry**: `/accounting/accounts`, `/accounting/coa-mappings`, `/accounting/fixed-cost-entries` GETs are all `page`-based on the REQUEST. Only `journals` is offset-IN. All four share the page-shaped response `PaginationMeta`. So you cannot copy a sibling's request-param code for journals.

**Fix (LNS-386):** request side only — in `journal.ts` `list()`, replace `searchParams["page"]` with `searchParams["offset"] = String((params.page - 1) * params.limit)`. UI model stays 1-based page end-to-end (`journal-list-impl.tsx` `page` state, `TablePagination` `currentPage` confirmed 1-based: prev/next `±1`, page buttons `i+1`). Conversion confined to the service boundary. Off-by-one is the prime defect: page1→offset0, page2→offset25.

**Why:** drift first noticed during LNS-384 grounding; deferred to its own ticket (LNS-386) since tenant-migration scope was shapes-unchanged. How to apply: any future journal-list work must respect offset-IN/page-OUT; do not "normalize" the request to page to match the response.
