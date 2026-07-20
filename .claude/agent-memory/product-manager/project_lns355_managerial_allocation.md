---
name: lns355-managerial-allocation
description: LNS-355 FE PRD — managerial fixed-cost allocation (off-GL loaded cost); contract from LNS-52 (Done, PR#249); 3 FE surfaces
metadata:
  type: project
---

LNS-355 = FE consumer of LNS-52 (BE Done, PR#249 merged, contract locked). Off-GL **managerial** loaded-cost allocation — NEVER statutory HPP. FE-only adoption: `Frontend` + existing `be-requested-fe`; NO `fe-requested-be` (BE shipped). PRD delivered to orchestrator 2026-06-25; moved Todo→In Progress.

**Why:** Indonesian SME manufacturers need fully-loaded per-unit cost (material + allocated production fixed cost) for pricing/margin, computed after a period closes — distinct from GL/tax HPP.

**How to apply (3 FE surfaces, all verified against FE source):**
1. **FixedCost `category`** (`production`|`general`, default `general`) — bundled into THIS ticket, no separate FE ticket. FE FixedCost entity/model has only `id,name,createdAt,updatedAt` — NO `owner_id` (phantom field is a no-op here; only ADD `category`). Touches create/edit dialogs under `settings/fixed-costs/_components/` + list rows.
2. **POST /accounting/periods/{id}/managerial-cost-allocation** — trigger on closed/locked period, no body, idempotent (re-run overwrites). Likely host `/finance/periods` (`period-row.tsx`).
3. **GET /accounting/periods/{id}/managerial-cost** — read-only projection, array (may be []), `?variant_id=` filter. Per-variant breakdown `material_cost_per_unit + allocated_production_fixed_per_unit = loaded_cost_per_unit`; empty array = not-yet-allocated signal.

**Verified FE facts (source-grounded):**
- Feature gate is **string-array `hasFeature("...")`** (`business-account.ts`) — NO `AccountFeature` enum on FE; existing strings `accounting|kyc|legacy_invoicing`. Exact managerial-costing token is a BE-contract unknown → EL.
- ProductType closed 3-set `manufactured|trading|service` (`product/domain/enums/product-type.ts`); scope = manufactured ONLY. Variant model has NO HPP/cost fields, no existing breakdown UI.
- Period status `open|closed|locked`; `isClosed = status !== "open"`.
- ServerError registry (`core/resources/server-error.ts`): has `FEATURE_NOT_AVAILABLE`, `PERIOD_NOT_CLOSED`, `FORBIDDEN`; **`PERIOD_NOT_FOUND` MISSING** (only generic `NOT_FOUND`) → EL to add/map.

**Locked C1 copy (render VERBATIM, never "HPP"):** label "Biaya Produk (Termasuk Biaya Tetap)"; disclaimer "Angka manajerial untuk analisa harga jual & margin. Bukan HPP laporan keuangan/pajak dan tidak memengaruhinya."; capacity_note "Dialokasikan atas dasar produksi aktual bulan ini (belum disesuaikan dengan kapasitas normal)." `cost_basis:"managerial"` is the distinct-from-statutory discriminator. See [[reference_indonesian_fintech_vocab]], [[project_periods_close_infra]].
