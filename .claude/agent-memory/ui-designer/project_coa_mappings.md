---
name: coa-mappings-current-structure
description: Current CoA mappings page layout, table grid, line shape, dialog form, and provider pattern — needed for redesign spec
metadata:
  type: project
---

Current structure at `/settings/coa-mappings`:

- Provider: `coa-mappings-provider.tsx` exposes `{ mappings, entityTypes, loading, setEditingItem, setDeletingItem }`
- Table: `CoaMappingsTable` uses `TableContainer` with `TableHeaderRow` (4-col grid: Jenis Transaksi | Debit | Kredit | ActionMenu)
- Row grid: `grid-cols-[minmax(200px,_1.1fr)_2fr_2fr_48px]`
- Debit column: `border-l-2 border-primary-200`; Credit column: `border-l-2 border-warning-200`
- Form dialog: `CoaMappingFormDialog` (display component) — has entityType select, entityId text input, line rows with Akun + Posisi + Label, add line CTA
- `CoaMappingLineRow` handles individual line editing with `LedgerAccountCombobox`
- Create/Edit dialogs exist today; Delete dialog exists

Planned redesign (accounting-bootstrap):
- Remove "Create new mapping" CTA (tenants cannot create)
- Remove Delete capability (seeded by BE)
- Rename "Context ID" field to something friendlier or hide entirely
- Add category-grouping to the list
- Line states: static (editable chip), dynamic ("Akun ditentukan saat transaksi" chip + tooltip), unassigned ("Belum dipilih" + CTA)
- `manual_endpoint` rows (expense_payment, pph_final_settle): informational-only with flow link — no edit
