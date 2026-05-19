---
name: project-account-1230-badge-surfaces
description: Decision matrix for where the "dikelola Loonas" badge/banner appears for account 1230 (Piutang Penyelesaian Loonas), plus verbatim copy
metadata:
  type: project
---

CPO locked: account 1230 "Piutang Penyelesaian Loonas" needs a platform-managed signal because merchants will ask reconciliation questions ("kenapa saldonya beda dari kas saya?"). See [[project-accounting-domain]] and [[project-coa-mapping-shape]] for the CoA context.

**Why:** Loonas sits in the money-flow path (settlement-receivable model). UMKM merchants don't think in accounting terms, so the signal must pre-empt the reconciliation question, not just decorate it.

**How to apply:** When designing any surface that exposes account 1230 to merchants, pick the treatment from the matrix below. Do not invent new placements without re-asking CPO.

## Surface matrix (v1)

| Surface | Treatment | Rationale |
|---|---|---|
| CoA list `/finance/ledger` | Chip | 1230 sits alongside 25 other accounts; disambiguates |
| CoA mapping detail (any line referencing 1230) | Chip | Same — appears alongside other accounts |
| Journal entry detail (posting line view) | Chip | Same — 1230 is one line among many |
| `LedgerAccountCombobox` search results | Chip, inline right of account name | Signal needed at point of selection |
| `/finance/ledger/1230` (account detail page) | **Banner** (NOT chip) | Page is dedicated to 1230; chip would be redundant. Banner pre-empts reconciliation question with context. |
| Balance sheet / report exports | **Deferred v2** | Different audience (accountants/banks); needs footnote treatment, not chip |

## Verbatim copy (Bahasa Indonesia) — use exactly

**Chip text** (all chip surfaces):
`dikelola Loonas`

**Chip tooltip** (hover/focus, all chip surfaces):
`Akun ini dikelola otomatis oleh Loonas. Saldonya mengikuti proses penyelesaian dana platform ke rekening bank Anda.`

**Banner** (only `/finance/ledger/1230`, persistent, NOT dismissible, info/neutral treatment — not warning):
- Judul: `Akun ini dikelola Loonas`
- Isi: `Saldo akun ini mencerminkan dana penjualan yang masih dalam proses penyelesaian Loonas ke rekening bank Anda. Saldo akan berkurang otomatis setiap kali Loonas mentransfer dana penyelesaian. Anda tidak perlu mencatat jurnal manual di akun ini.`

## Component name
`ManagedByLoonasBadge` (chip variant) — UI Designer's spec.
Banner variant: TBD by UI Designer, but reuse the same copy bundle.
