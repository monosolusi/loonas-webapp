---
name: project-profitability-contract-2026-06-25
description: LNS-347 profitability (HPP/laba-kotor/rekomendasi-harga) BE contract — 4 per-variant GETs, no aggregate endpoint, Indonesian response keys, two distinct needs-data signals
metadata:
  type: project
---

LNS-347 FE HPP / Laba Kotor / Rekomendasi Harga — BE LNS-42 (PR #240) contract, verified LIVE 2026-06-25 against `https://dev-api.loonas.id/openapi.json`.

**Why:** net-new `features/profitability` module; render-only (zero FE calc); recurring planning surface across Phase-3/Phase-7.
**How to apply:** re-fetch live spec each pass (mutable); transcribe Indonesian keys verbatim.

**Phase-7 re-validation (LNS-347, 2026-06-25):** all 6 schemas byte-identical between Phase-3 fetch (611457B) and fresh Phase-7 fetch (612064B — BE shipped ~600B elsewhere, NOT on profitability). All 6 model `fromJson` key-by-key verbatim-correct; service query params `quantity`/`margin` match (both required). Contract CLEAN — no SWE micro-fix needed at re-validation.

Four idempotent **GET** endpoints (all bare result objects, NO `{data}` wrapper), all `integer` IDR money already rounded BE-side:
- `GET /products/{product_id}/variants/{variant_id}/hpp` → `VariantHppResult{variant.id, material_cost_per_unit, packaging_cost_per_unit, overhead_cost_per_unit, hpp_per_unit, basis:"WAC", lines[]}`. `HppLine{raw_material.id, quantity, weighted_average_cost, line_cost, cost_available}` — `cost_available:false` = missing WAC, line stays at 0 (partial-data flag). Query: optional `packaging_cost`, `overhead_cost`.
- `GET …/production-cost` → `VariantProductionCostResult{variant.id, quantity, hpp_per_unit, fixed_component, variable_component, total_production_cost, period{from,to}}`. Query: **REQUIRED `quantity`** (exclusiveMin 0), optional `packaging_cost`/`overhead_cost`/`date_from`/`date_to`.
- `GET …/gross-profit` → `VariantGrossProfitResult{variant.id, needs_data(bool), needs_data_reason("NO_POS_SALES_IN_PERIOD"), estimasi_laba_kotor(int,nullable), is_estimate, basis:"HPP_PER_UNIT", formula, inputs(nullable){hpp_per_unit,units_sold,pos_revenue,period}}`. Query: optional `date_from`/`date_to`. **needs_data=true ⇒ value+inputs null, HTTP 200 (NOT error).**
- `GET …/recommended-price` → `VariantRecommendedPriceResult{variant.id, hpp_per_unit, margin_persen, recommended_price, basis_perhitungan:"HPP_PER_UNIT"}`. Query: **REQUIRED `margin`** (number, min 0, max 1000, multipleOf 0.01 — margin is a PERCENT, 30=30%). Separate GET per margin → SWR key includes margin; debounce input.

**Indonesian response keys (transcribe verbatim — Rule #15):** `estimasi_laba_kotor`, `margin_persen`, `basis_perhitungan`, `needs_data`, `needs_data_reason`.

**TWO distinct needs-data signals (branch both):** (1) no-POS = gross-profit `needs_data:true` payload flag at HTTP 200; (2) incomplete-recipe/no-BOM = HTTP **422** on ALL four endpoints, body `Error{code,message}` "Recipe is incomplete — variant has no BOM lines". The 422 `code` literal is NOT pinned in schema (prose only) → branch on HTTP 422 status, not a code literal. See [[project_server_error_code_passthrough]].

**No aggregate/dashboard endpoint** — dashboard = per-variant FAN-OUT. Enumerate via `GET /products` (`{data:Product[], meta:PaginationMeta{page,limit,total,total_pages}}`); `Product.variants[]` is embedded so one page yields variants + parent product_id (drill `{product_id}/{variant_id}` identifier-reachable, no extra lookup). Mandate lazy per-row fetch + pagination (perf NFR).

**Period:** production-cost + gross-profit take optional `date_from`/`date_to` (yyyy-MM-dd); hpp + recommended-price are period-independent. Response echoes `period{from,to}` used. v1 recommendation = BE-default window (no FE selector); period selector is a PM/CPO design question, not a blocker.

Existing reuse: `features/product` `use-list-products` + `VariantModel` (id/name/sku/price/metadata.hasRecipe/product) for enumeration. All four calc surfaces are net-new. Related: [[project_accounting_module_audit_2026_05]].
