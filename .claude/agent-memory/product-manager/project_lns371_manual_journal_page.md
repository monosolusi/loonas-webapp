---
name: lns371-manual-journal-page
description: LNS-371 manual journal entry create page — FE-only, builds on shipped LNS-364 editor + LNS-369 write infra; no detail page exists so success navigates to list
metadata:
  type: project
---

LNS-371 = FE Manual Journal Entry **create** page (Jurnal Baru CTA on `/finance/journals` → form at `/finance/journals/new`). Phase-1 PRD produced 2026-06-24, issue moved to In Progress.

**Why:** last-mile create surface — BE (LNS-107), write infra (LNS-369), and line editor (LNS-364) all shipped + merged; only the posting UI was missing.

**How to apply (for LNS-371 build + the sibling detail/reverse ticket):**
- FE-only ticket: contract shipped, no `fe-requested-be`. Reuse `journal-line-editor/` component set + `use-journal-line-balance` (LNS-364) and `use-create-journal` discriminated result (LNS-369). Do NOT rebuild either or call the service directly.
- **No journal detail page exists in the repo** (only `finance/journals/page.tsx` list). LNS-371's own body has a typo self-referencing "detail (LNS-371)" — detail/reverse is the separate sibling ticket (LNS-372-ish), NOT built. So success navigation = back to the journals list, not a detail page.
- Contract authority = [[journal-write-contract]], NOT the LNS-371 ticket body (its body is stale: shows pre-JWT `/accounts/{accountId}/journals` path + a `date/reference_type/reference_id` create body — both wrong; create body is `posting_date/memo/lines/acknowledged_warning_codes`, JWT-resolved path, reference_type/reference_id are response-only).
- LNS-369 deferred journals-list SWR revalidation to the consumer — LNS-371 owns triggering it on successful post.
- Double-submit: in-flight disable mandatory; live spec declares `Idempotency-Key` header on POST (BE-ready) — flagged to EL whether to wire now.
- Open BE-contract unknown handed to EL: `warnings[]` item shape (`code/severity{info|warning|hard}/account_id/suggested_alternative`) sourced from BE `WarningEntryDto`, not yet published to OpenAPI — re-verify at build.

**FINALIZED 2026-06-24 (Phase-3 rulings, both consults GREEN — PRD finalized, GREEN to build):**
- reference_type/reference_id stay OUT of manual create form (response-only). CONFIRMED.
- Role gate on posting: DEFERRED from v1 (no FE role/capability primitive exists; rely on BE auth + generic error surface). Filed separately as fe-requested-be "FE role/permission primitive for accounting write actions".
- Warning-copy vocabulary: ACCEPT graceful fallback for v1 (curated Bahasa for known codes, legible code fallback for unknown; unknown codes still echoed in acknowledged_warning_codes). BE-relay flag raised to get canonical code vocab + copy for fast-follow.
- Idempotency-Key: WIRE NOW. One crypto.randomUUID() per form session, HELD across warn→ack resubmit + 2nd re-warn loop, regenerated only on payload-changing retry after hard failure. ~4-file additive thread-through (usecase→repo→service param; HttpRequest supports per-request headers). Registry has IDEMPOTENCY_KEY_CONFLICT/IN_PROGRESS (409).
- Closed-period: NO client pre-check; PERIOD_CLOSED may be 409 OR 422 — surface status-agnostically via generic message pipeline.
- List revalidation: SWR key is ARRAY `["list-journals", {clerk,params}]` — string-exact revalidateSWRKey WON'T match; use predicate `mutate(key => Array.isArray(key) && key[0]===ACCOUNTING_SWR_KEYS.LIST_JOURNALS)`. isMutating drives in-flight disable.
- Submit gate (final): `isBalanced && totalDebit>0 && !!postingDate && !isSubmitting` — the totalDebit>0 clause closes the degenerate all-zero-balanced case.
- ROUTE_MAP: add `/finance/journals/new`→"Jurnal Baru" AND `/finance/journals`→"Jurnal Umum" (the list entry was missing → fell back to "Dashboard"; fix here).
- UI: 2 SectionCards (Detail Jurnal / Baris Jurnal); 3-tier LoonasDialog (NOT ConfirmationDialog); "Tetap Posting" is PrimaryButton not Danger; resubmit dialog allowDismiss=false + Batal disabled; success→toast→revalidate→router.push("/finance/journals").
- Discard-guard: DEFERRED to v1.1 (no repo primitive).
- 3 non-blocking BE-relay flags: (a) publish WarningEntry schema; (b) confirm PERIOD_CLOSED status code 409 vs 422; (c) provide WarningEntry.code vocab + Bahasa copy.
