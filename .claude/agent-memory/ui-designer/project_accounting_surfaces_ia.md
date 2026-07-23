---
name: accounting-surfaces-ia
description: IA, routes, nav, and surface-level design decisions for the 7 net-new accounting FE surfaces (CoA Editor, Manual Journal, Reports Hub, Period Close, Opening Balance, Tax Settings, PPh Final)
metadata:
  type: project
---

Last updated: 2026-06-14.

## Nav IA decision

All new surfaces extend the existing `FinanceNavGroup` (gated `hasFeature("accounting")`). No second nav group.

Operational surfaces → `/finance/*`:
- `/finance/reports` — Laporan Keuangan (hub with tab switcher)
- `/finance/periods` — Periode Akuntansi
- `/finance/tax` — Pajak (existing, from bootstrap plan)

Configuration surfaces → `/settings/*`:
- `/settings/chart-of-accounts` — Bagan Akun (NEW, distinct from `/settings/coa-mappings`)
- `/settings/tax-settings` — Pengaturan Pajak
- `/settings/opening-balance` — Saldo Awal

`FinanceNavGroup` matchPrefixes must include `/finance/reports`, `/finance/periods`, `/finance/tax`.

A `<hr className="my-1 border-neutral-100" />` divider separates the transactional trio (ledger/journals/fixed-costs) from the new analytical trio (reports/periods/tax) within the NavigationGroup children.

## Reports Hub decision

One `/finance/reports` route with tab switcher (not 6 separate routes). Tab order:
Laba Rugi | Neraca | Arus Kas | Buku Besar | Neraca Saldo | CALK

Default tab: Laba Rugi (owner-first: profitability over ledger accuracy).

Period zone uses `bg-primary-50 rounded-xl p-4` container (consistent with LNS-227 dashboard pattern).

Reports tabs with 6 labels ~700px total — must `overflow-x-auto` on narrow viewports.

## PPh Final Self-Settle

Lives as a 2-step dialog on `/finance/tax`, NOT a new route. Double-submit guard: PrimaryButton loading prop auto-disables. Step 2 shows journal preview before posting.

## Year-end close

Multi-step FULL PAGE at `/finance/periods/year-close?year=YYYY`. Typed confirmation (user types the year) before DangerButton. Year reopen at `/finance/periods/year-reopen?year=YYYY` adds confirmation_token field (type="password").

## Opening Balance wizard

`/settings/opening-balance`. One-shot flow. Already-done state = read-only summary. 422 NORMAL_BALANCE_HINT handled inline per-row (warning, not block). Deficit block = dead-end in v1.

## ROUTE_MAP additions required (header-title.tsx)

/finance/reports → "Laporan Keuangan"
/finance/periods → "Periode Akuntansi"
/finance/periods/year-close → "Tutup Tahun Fiskal"
/finance/periods/year-reopen → "Buka Kembali Tahun Fiskal"
/finance/journals/new → "Jurnal Umum"
/finance/journals → "Jurnal Umum"
/settings/chart-of-accounts → "Bagan Akun"
/settings/tax-settings → "Pengaturan Pajak"
/settings/opening-balance → "Saldo Awal"

## Critical open questions (BE relay needed)

- Surface 6: GET /accounting/settings must return full settings shape (legal_form, is_pkp, npwp, etc.) not just tax_accounts. Block implementation on confirmation.
- Surface 2: Is reference_id free-text or FK? Changes form significantly.
- Surface 4: Does year-end close require FE-generated Idempotency-Key?
- Surface 5: Does 422 NORMAL_BALANCE_HINT block full submission or allow per-line acknowledgment?
