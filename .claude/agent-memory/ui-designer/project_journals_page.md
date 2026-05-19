---
name: journals-page-current-layout
description: Current /finance/journals layout and components — context for adding Expense Payment CTA
metadata:
  type: project
---

Location: `src/app/(authenticated)/finance/journals/`

- Page: single `<JournalListImpl />` composition
- `JournalListImpl`: uses deprecated `InvoiceTableShell` (leave as-is for now; new components follow TableToolbar/TableContainer)
- Summary cards row: 3x `SummaryCard` — Total Debit, Total Kredit, Selisih
- Table columns: Tanggal | Memo | Total Debit | Total Kredit (grid `grid-cols-[1.5fr_3fr_1fr_1fr]`)
- Toolbar: search input aligned right, `w-[280px]`
- No CTA today — "Catat Biaya" button will be added to toolbar (left side, primary button)
- After accounting-bootstrap, toolbar becomes: `[PrimaryButton "Catat Biaya"] ... [search input]`
- New dialog: `ExpensePaymentDialog` (no new route; open/close state in provider or local state)
- Title in ROUTE_MAP missing for `/finance/journals` — needs adding as "Jurnal Umum"
