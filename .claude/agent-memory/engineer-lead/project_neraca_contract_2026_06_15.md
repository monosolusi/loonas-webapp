---
name: neraca-contract-2026-06-15
description: LNS-373 verified live BE Neraca (balance sheet) contract — 3-level nesting, parallel compare_to fields, richer _imbalance than shell type
metadata:
  type: project
---

Verified verbatim from live OpenAPI (`https://dev-api.loonas.id/openapi.json`, Loonas API 1.0.0 / OpenAPI 3.0.3) on 2026-06-15 for LNS-373 Phase-2 feasibility. `GET /accounting/reports/neraca`, response `{ data: Neraca }`.

**Why:** PM's WebFetch summarizer truncated before the accounting-reports section; PM assumed a flat `sections[] -> lines[]` shape. The real contract is 3-level nested and richer. This gates the LNS-373 typed-model task (C2).

**How to apply:** When writing the LNS-373 typed Neraca model/entity, mirror this shape with Model classes for nested refs (NeracaSectionModel -> NeracaBucketModel -> NeracaLineModel), `fromJson`/`toEntity`. compare_to binding is parallel fields, not a separate object.

Shape (3-level nest: `Neraca.sections[] (section) -> buckets[] (NeracaBucket) -> lines[] (NeracaLine)`):

- `meta`: tenant_id(uuid), title (canonical "Laporan Posisi Keuangan"), subtitle (canonical "Neraca"), as_of(date), as_of_display (long ID date e.g. "30 Juni 2026"), compare_to(date|null), compare_to_display(string|null), fiscal_year_start_as_of(date), fiscal_year_start_compare_to(date|null), period_status("open"|"closed"), currency(string), generated_at(date-time).
- `sections[]` = NeracaSection: section enum("aset"|"liabilitas"|"ekuitas"), label (UPPERCASE: ASET|LIABILITAS|EKUITAS), display_order(int), buckets[], total_as_of(number), total_compare_to(number|null).
- `buckets[]` = NeracaBucket: bucket enum (14 values: kas, piutang, persediaan, aset_lancar_lain, aset_tetap, akumulasi_penyusutan, utang_usaha, utang_pajak, liabilitas_lancar_lain, liabilitas_jangka_panjang, modal_disetor, prive, saldo_laba, laba_tahun_berjalan), label(ID), display_order(int), lines[], subtotal_as_of(number), subtotal_compare_to(number|null).
- `lines[]` = NeracaLine: account_code, account_name, account_type enum(asset|contra_asset|liability|equity|contra_equity|revenue|contra_revenue|expense|contra_expense|cogs), balance_as_of(number), balance_compare_to(number|null), is_abnormal_balance(bool), is_virtual(bool).
- `totals`: total_aset_as_of, total_liabilitas_ekuitas_as_of, total_aset_compare_to(null-able), total_liabilitas_ekuitas_compare_to(null-able).
- `_imbalance`: { aset:number, liabilitas_ekuitas:number, delta:number, is_balanced:bool } — RICHER than shell's `RawImbalance` type ({is_balanced?, delta?}); `mapImbalance` ignores the two extra fields, which is fine (lossy but compatible).

Params: `as_of` required (regex `^\d{4}-\d{2}-\d{2}$`), `compare_to` optional (same regex), `api-version` header default "v1". Errors: 400/403 -> `Error { code, message }`. No 404, no documented empty-shape variant (empty-state trigger is a BE-behavior question — not derivable from schema).
