---
name: reference-linear-accounting-fe-batch
description: 2026-06-14 accounting FE batch tickets (LNS-364..381) under project Accounting—UMKM Non-PKP; foundation+surfaces+BE-clarifications dependency graph
metadata:
  type: reference
---

Filed 2026-06-14 under project "Accounting — UMKM (Non-PKP) Feature-Completeness" (epic LNS-96) — the FE presentation layer for the now-shipped accounting BE. Source: live OpenAPI at https://dev-api.loonas.id/openapi.json (Redoc at /docs; `/docs-json` 404s).

**Foundation (FE):** LNS-364 journal-line editor (shared by manual journal + opening balance), LNS-365 report shell (blocks all 6 viewers), LNS-369 journal write/get/reverse infra (blocked by LNS-366).

**Surfaces (FE):** LNS-117 (refined) CoA editor @ /settings/chart-of-accounts; LNS-371 manual journal entry; LNS-372 journal detail+reverse; LNS-373 Reports hub+Neraca (proves shell); LNS-374 Laba Rugi+Arus Kas; LNS-375 Trial Balance+General Ledger (drill-down/pagination); LNS-376 CALK viewer; LNS-377 periods list+close+reopen; LNS-378 year-end close+reopen-year; LNS-379 opening-balance wizard; LNS-380 tax posture settings; LNS-381 PPh Final self-setor.

**BE clarifications (fe-requested-be, blockers):** LNS-366 journal {accountId} path param vs JWT-resolved account (HARD blocker for LNS-369→371/372) + warnings[] shape; LNS-367 no GET for current tax posture (blocks LNS-380 hydrate); LNS-368 opening-balance 422 shape + reopen-year confirmation_token source + period-close Idempotency-Key enforcement; LNS-370 CoA DELETE semantics + journal-line-count error shape.

**Key build-order facts:** CoA read layer + LedgerAccountCombobox ALREADY EXIST (not a ticket) — combobox is the shared account picker for journal editor, reports, opening balance, year-end RE picker, pph cash picker. Opening-balance + pph-final use their OWN endpoints (depend on LNS-364 editor, NOT LNS-369 journal infra). LNS-373 must land before 374/375/376 (proves shell). Periods infra (LNS-377) blocks year-end (LNS-378).

**Existing related FE tickets (not in this batch, aligned):** LNS-305 normal-balance sign, LNS-344 opening-balance copy (blocks LNS-379), LNS-347 HPP profitability, LNS-353 details.code migrate, LNS-354 fixed-cost period guard, LNS-355 alokasi biaya tetap.

See [[project-accounting-be-done-fe-gap]], [[project-finance-nav-ia]], [[reference-linear-accounting-bootstrap-v1]].
