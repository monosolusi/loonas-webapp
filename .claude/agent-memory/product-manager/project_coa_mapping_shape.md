---
name: project-coa-mapping-shape
description: Plan B+ revised CoA mapping shape — amount_role, account_role dynamic resolution, 3-shape account field, entity-type catalogue
metadata:
  type: project
---

The Plan B+ Accounting Bootstrap release (May 2026) changed the CoA mapping contract:

**Mapping line additions:**
- `amount_role` (string) — semantic role of the amount in this line (e.g., `gross`, `cogs`, `tax_base`).
- `account_role` (string | null) — when non-null, the posting account is resolved from the **event payload at posting time**, not from the static mapping. The mapping's `account` field is informational only.
- `account` (object | null) — three response shapes: fully hydrated `{id, code, name, type, parent_id, balance, total_debit, total_credit}` | stub `{id}` only | `null`. Always null-check before nested access.

**Entity-type catalogue additions:**
- `category` enum: Penjualan | Pembelian | Persediaan | Operasional | Pajak | Settlement
- `pattern` enum: `auto_outbox` | `manual_endpoint` | `tenant_configures` (reserved, unused in this release)
- `requires_account_role` (bool) — true for the 5 types that have dynamic account resolution lines

**The 18 entity types (codes):**
- pos_sale_cash, pos_sale_cashless, stock_out_goods, stock_out_raw_material, purchase_goods, purchase_raw_material, purchase_goods_cash, purchase_raw_material_cash, production, invoice_out_credit, ar_receipt, ar_escrow_receipt, ap_payment, escrow_settle, expense_payment, pph_final_settle, stock_write_off, opname_adjustment
- `manual_endpoint` (2): expense_payment, pph_final_settle (no seeded mapping — journals posted via POST endpoints)
- `requires_account_role: true` (5): purchase_goods_cash, purchase_raw_material_cash, ar_receipt, ap_payment, escrow_settle

**Why:** account resolution must follow the actual payment instrument used in a transaction (e.g., for `ar_receipt`, the cash/bank account differs per receipt event). Static mapping cannot express this — hence `account_role`.

**How to apply:** Current FE CoA mapping page (`/settings/coa-mappings`) does NOT model these fields. The page treats every line as fully resolvable to one static account. It needs a rewrite to (a) handle the 3-shape account field defensively, (b) display dynamic-role lines as "auto-resolved at posting" rather than a fixed account, (c) hide or differentiate `manual_endpoint` entity types from the static mapping list.
