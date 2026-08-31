---
name: fetcher-singular-noun-rule-vs-legacy-plurals
description: CLAUDE.md's singular-noun fetcher rule is violated by legacy fetchers (incl. the canonical cost-valuation-gaps exemplar) — how to grade new-code plurals
metadata:
  type: feedback
---

CLAUDE.md's Fetcher Naming rule ("SWR fetcher functions use singular noun") is contradicted by shipped fetchers: `ListInvoicesFetcher`, `ListProductsFetcher`, `ListCategoriesFetcher`, `ListMembersFetcher`, `ListInvitationsFetcher`, and `ListCostValuationGapsFetcher` — the last being the canonical post-LNS-757 exemplar CLAUDE.md itself points to for the refresh pattern. The singular rule IS nonetheless followed by the majority and by the named donors (`ListStockMovementFetcher`, `ListStockItemFetcher`).

**Why:** Survey done 2026-08-31 during LNS-755 review; the new `ListBalanceMovementsFetcher` (plural) was flagged Minor against both the CLAUDE.md table and its own donor.

**How to apply:** Flag a NEW plural fetcher name as Minor (convention-table violation + donor mismatch), and state the legacy counter-examples in the finding so the EL can judge — but never flag pre-existing plurals, and never let "the exemplar is plural too" suppress the flag on new code. When a ticket names a pattern donor, the donor's fetcher name is the tiebreaker, not the loudest in-repo outlier. Outcome (2026-08-31, LNS-755 round 2): the flag was accepted and fixed as a pure rename — `ListBalanceMovementFetcher(Params)`, 4 occurrences across hook + types file, verified clean by grep. The flag grade (Minor, non-blocking) was the right severity.
