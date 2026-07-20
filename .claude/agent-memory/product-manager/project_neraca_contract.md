---
name: project-neraca-contract
description: LNS-373 — GET /accounting/reports/neraca live contract is 3-level nested (sections→buckets→lines); full field map + enums, confirmed from live OpenAPI by EL
metadata:
  type: project
---

`GET /accounting/reports/neraca` (as_of required, compare_to optional) → `{ data: Neraca }`. JWT-resolved tenant (no account id). Contract is **3-level nested** — sections → buckets → lines (NOT flat sections→lines). Confirmed against live OpenAPI by EL during LNS-373 Phase 2 (2026-06-15).

- **Neraca (root):** `{ meta, sections[], totals, _imbalance }`
- **meta:** `tenant_id`, `title` ("Laporan Posisi Keuangan"), `subtitle` ("Neraca"), `as_of`, `as_of_display` (long ID date "30 Juni 2026"), `compare_to`(nullable), `compare_to_display`(nullable), `fiscal_year_start_as_of`, `fiscal_year_start_compare_to`(nullable), `period_status` ("open"|"closed"), `currency`, `generated_at`
- **sections[]** (NeracaSection): `section` enum (`aset`|`liabilitas`|`ekuitas`), `label` (UPPERCASE), `display_order` (int — AUTHORITATIVE; BE may return unsorted, FE must sort), `buckets[]`, `total_as_of`, `total_compare_to`(nullable)
- **buckets[]** (NeracaBucket): `bucket` (14-value enum: kas, piutang, persediaan, aset_lancar_lain, aset_tetap, akumulasi_penyusutan, utang_usaha, utang_pajak, liabilitas_lancar_lain, liabilitas_jangka_panjang, modal_disetor, prive, saldo_laba, laba_tahun_berjalan), `label` (ID), `display_order` (int), `lines[]`, `subtotal_as_of`, `subtotal_compare_to`(nullable)
- **lines[]** (NeracaLine): `account_code`, `account_name`, `account_type` enum, `balance_as_of`, `balance_compare_to`(nullable), `is_abnormal_balance` (bool), `is_virtual` (bool)
- **totals:** `total_aset_as_of`, `total_liabilitas_ekuitas_as_of`, `total_aset_compare_to`(nullable), `total_liabilitas_ekuitas_compare_to`(nullable)
- **_imbalance:** `{ aset, liabilitas_ekuitas, delta, is_balanced }` (richer than the shell's `mapImbalance` RawImbalance `{is_balanced?, delta?}`, but forward-compatible — extra fields ignored by shell)

**compare_to behavior:** comparison values arrive as PARALLEL `*_compare_to` fields at every level in the SAME response (no separate object). All `*_compare_to` are null when `compare_to` omitted. Second-column presence is driven by `meta.compare_to != null`.

**Empty vs zero:** BE-behavior, not visible in schema. FE dual-guards: `sections.length === 0` → empty state; populated zero-amount sections → valid all-zero render. NOT a blocker.

LNS-373 v1 product calls (PM): (1) compare_to UI DEFERRED to follow-up — model carries the fields, viewer is single-column v1; (2) `is_abnormal_balance` surfaced as a subtle line marker, `is_virtual` rendered plainly/ignored; (3) `period_status` chip OMITTED v1 (field kept on model); (4) Neraca-specific empty copy, page-local (shell not extended).

**Why:** the section/totals shape was `Record<string,any>` passthrough in the shell ([[project-report-shell-contract]]); this is the typed shape the LNS-373 viewer + 4-class model (NeracaModel→Section→Bucket→Line) bind to. **How to apply:** ground any Neraca render/AC work here; reuse the bucket enum + display_order ordering rule. See [[project-report-shell-contract]], [[reference-indonesian-fintech-vocab]].
