---
name: laba-rugi-arus-kas-contract-2026-06-16
description: LNS-374 verified exact response shapes for /accounting/reports/laba-rugi (POST) and /accounting/reports/arus-kas (GET) from live OpenAPI spec
metadata:
  type: project
---

LNS-374 contract lock (live spec re-fetched 2026-06-16, HTTP 200). Both compute endpoints shipped; FE plumbing (hook/usecase/repo/service) exists from LNS-365 but `data` is `Record<string,any>` passthrough — typed shapes + viewers + tab-enable are net-new. See sibling [[neraca-contract-2026-06-15]] and [[tb-gl-contract-2026-06-16]] for the precedent pattern.

## Laba Rugi — POST /accounting/reports/laba-rugi (opId getLabaRugi)
Body `{from, to, compare_from?, compare_to?}` all `^\d{4}-\d{2}-\d{2}$`. **Constraint: `to` >= `from` AND same calendar year** (BE-enforced, 400 on violation). compare_from/compare_to must be paired, no overlap with primary. Response `{ data: LabaRugiReport }`.

LabaRugiReport: `{ meta, current: LabaRugiPeriod, compare: LabaRugiPeriod|null }`.
- meta: `account_id`(uuid), `currency`("IDR" enum), `from`(date), `to`(date), `compare_from`(date|null), `compare_to`(date|null), `generated_at`(date-time).
- LabaRugiPeriod (FIXED keys, NOT a sections[] array — flat named buckets):
  - `pendapatan`: LabaRugiBucket
  - `harga_pokok_penjualan`: LabaRugiBucket
  - `laba_kotor`: number (computed subtotal)
  - `biaya_operasional`: LabaRugiBucket
  - `laba_operasional`: number
  - `pendapatan_lain_lain`: LabaRugiBucket | null
  - `beban_lain_lain`: LabaRugiBucket | null
  - `laba_sebelum_pajak`: number
  - `pajak`: LabaRugiBucket
  - `laba_bersih`: number  ← net P/L figure
- LabaRugiBucket: `{ label: string, lines: LabaRugiLine[], subtotal: number }`
- LabaRugiLine: `{ account_code, account_name, account_type("revenue"|"cogs"|"expense"), amount(number, natural-side; neg=abnormal), is_abnormal_balance(bool) }`
NOTE: no display_order anywhere in LabaRugi; render in declared bucket order. account_code NOT guaranteed unique in a bucket → composite `${account_code}-${index}` for React key.

## Arus Kas — GET /accounting/reports/arus-kas (opId getArusKas)
Query `from`, `to` both required `^\d{4}-\d{2}-\d{2}$`. Response `{ data: ArusKas }`.

ArusKas (all listed required): `{ meta, operasi, investasi, pendanaan, total_arus_kas(number), total_arus_kas_label(string), saldo_kas_awal(number), saldo_kas_awal_label, saldo_kas_akhir(number), saldo_kas_akhir_label, _imbalance, non_cash_transactions[] }`.
- non_cash_transactions: v1 ALWAYS `[]` (items schema empty `{}`).
- meta (ArusKasMeta): `account_id`(uuid), `currency`("IDR"), `period_from`, `period_to` (NOTE: period_* not from/to), `entity_type_used_for_labels`("op"|"op_fallback"|"cv_firma"|"pt"|"koperasi" — drives Pendanaan labels), `generated_at`, `period_statuses[]:{period(yyyy-MM), status("open"|"closed")}`.
- **THREE SECTIONS HAVE DIFFERENT SHAPES — do NOT model uniformly:**
  - operasi (ArusKasOperasi): `{ label, laba_bersih(number, == LabaRugi.laba_bersih), penyesuaian: ArusKasLine[] (v1 always []), perubahan_modal_kerja: ArusKasLine[], subtotal: ArusKasSubtotal }` — NO `lines` key.
  - investasi (ArusKasInvestasi): `{ label, lines: ArusKasLine[], subtotal: ArusKasSubtotal }`
  - pendanaan (ArusKasPendanaan): `{ label, lines: ArusKasLine[], subtotal: ArusKasSubtotal }`
- ArusKasLine: `{ label(string), raw_balance_delta(number), cash_impact_delta(number — the value shown on the line; neg=cash use), is_abnormal_balance(bool) }` — NO account_code/account_name (label-only rows).
- ArusKasSubtotal: `{ label(string, SAK-EMKM parenthetical), amount(number; neg=net outflow) }`
- _imbalance (ArusKasImbalance, RICHER than shell RawImbalance {is_balanced,delta}): `{ total_arus_kas, delta_saldo_kas, delta(=total_arus_kas - delta_saldo_kas), is_balanced(|delta|<0.01), breakdown:{operasi_subtotal, investasi_subtotal, pendanaan_subtotal, saldo_kas_awal, saldo_kas_akhir} }`. mapImbalance() reads is_balanced+delta only — sufficient for the imbalance banner.

## Empty signal (EL-2)
- Laba Rugi: no array length to test. Empty = all buckets have `lines.length === 0` AND all numeric subtotals/laba_* are 0. Recommend treating empty as "every LabaRugiBucket.lines is empty". Confirm wording with PM.
- Arus Kas: operasi.penyesuaian + operasi.perubahan_modal_kerja + investasi.lines + pendanaan.lines all empty AND total_arus_kas===0 && saldo_kas_awal===0 && saldo_kas_akhir===0. period_statuses always populated so not a signal.
