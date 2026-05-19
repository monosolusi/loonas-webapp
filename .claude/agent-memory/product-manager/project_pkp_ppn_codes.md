---
name: project-pkp-ppn-codes
description: Renumbered PPN/PPh Final code map (2026-05-12 BE reply). PPN now lives at canonical 1410/2210; PPh Final relocates to 1420/2220.
metadata:
  type: project
---

PKP/PPN code map — RENUMBERED 2026-05-12 (supersedes prior LNS-67 ratification).

Target post-migration state of the four tax accounts:

- **1410** — PPN Masukan (asset) — canonical slot, was "PPh Final Dibayar Dimuka"
- **1420** — PPh Final Dibayar Dimuka (asset) — RELOCATED from 1410
- **2210** — Utang Pajak PPN (liability) — canonical slot, was "PPh Final Terutang"
- **2220** — PPh Final Terutang (liability) — RELOCATED from 2210

**Why:** BE owns the canonical numbering. PPN is the high-volume flow and earns the first slot; PPh Final relocates to make room. System mappings reference seed-time IDs, so user-created accounts cannot satisfy PPN posting — manual-create path is dropped.

**How to apply:**
- All copy naming PPN accounts: **1410 PPN Masukan**, **2210 Utang Pajak PPN**.
- All copy naming PPh Final accounts: **1420 PPh Final Dibayar Dimuka**, **2220 PPh Final Terutang**.
- `/finance/tax` page accrued-balance query: account **2220** (not 2210) post-migration.
- "Tambah Manual" CTA in CoA viewer: **dropped**. No manual-create for tax accounts.
- `CoaPkvRequiredSection`: **dropped** under both v1 branches.
- v1 ships in one of two branches (pending BE confirmation this cycle):
  - **Branch A**: BE auto-seeds 1410/2210 on PKP flip via same migration that moves PPh Final. FE shows transient success toast.
  - **Branch B**: PKP toggle is CTA-only (WhatsApp handoff). `is_pkp=true` is metadata-only in v1; no in-product PPN config.

Open BE relay: confirm renumbering reading; confirm tenant ledger data migration semantics (balances on old 1410/2210 must move to 1420/2220, not be silently overwritten by new PPN seed).

Related: [[project-accounting-domain]], [[project-coa-mapping-shape]], [[project-account-1230-badge-surfaces]]
