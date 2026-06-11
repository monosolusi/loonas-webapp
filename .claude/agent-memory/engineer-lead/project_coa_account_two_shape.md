---
name: coa-account-two-shape
description: BE v1 CoA mapping returns line.account in 2 shapes (full | null); narrow to LedgerAccountEntity | null, no stub union
metadata:
  type: project
---

Plan B+ Accounting BE v1 (locked 2026-05-12 via PRD) returns each CoA mapping line's `account` field in **exactly two** shapes: full `LedgerAccount` object (static lines) or `null` (dynamic lines whose account is resolved per event payload at runtime). The previously-feared `{id}`-only stub case is unreachable on v1 and was removed from the contract. Each line carries `amount_role` (always present, 7-value enum) and `account_role` (nullable — null = static line, non-null = dynamic line with `received_to` | `paid_from`).

**Why:** Earlier plan iterations modeled a three-shape tagged union; B2 lock simplifies this. FE must still narrow safely from the pre-existing scaffolding's `LedgerAccountModel.fromJson(data["account"])` which crashes on null.

**How to apply:** When planning or implementing accounting work that touches mapping lines:
1. Entity field: `account: LedgerAccountEntity | null`. No tagged union, no stub branch.
2. `fromJson` does a simple `data["account"] ? LedgerAccountModel.fromJson(data["account"]) : null`.
3. Line guards: `isStaticLine(line)` (accountRole === null) vs `isDynamicLine(line)` (accountRole !== null). Render via discriminator + separate components — no inline conditionals.
4. Treat the `coa-mappings` GET response as a bare array, **not** paginated.
5. `update-coa-mapping` PUT payload must strip dynamic-role lines (BE rejects them v1). Filter belongs in the use case, not the repo.
6. Entity-type catalogue carries `category`, `pattern`, `requires_account_role` — pattern `manual_endpoint` means writes go through `/accounting/expenses-payment` and `/accounting/pph-final-settle` (both accept `Idempotency-Key` header, BE-ignored v1 / activated v2).
7. `amount_role` enum: `primary | gross | dpp | ppn_out | ppn_in | disbursement_fee | net_amount`. PKP-only members: `gross | dpp | ppn_out | ppn_in`. UMKM tenants collapse those FE-side via `is_pkp` from `useGetAccountingSettings()`.
