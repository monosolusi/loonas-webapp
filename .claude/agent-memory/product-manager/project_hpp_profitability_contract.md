---
name: hpp-profitability-contract
description: LNS-347 FE profitability views consume LNS-42 (Done) HPP contract — RESOLVED: 4 idempotent GETs, margin 0/1000/0.01, two needs-data signals (200 flag vs 422)
metadata:
  type: project
---

LNS-347 (FE: HPP, Laba Kotor & Rekomendasi Harga Jual — profitability views) is the FE half split out of LNS-42. **LNS-42 is BE-only and Done** (merged BE PR #240 on `loonas-api`); LNS-21 (POS recording) also Done. The FE renders BE-computed numbers only — NO calculation logic in FE.

**Contract RESOLVED by EL against live OpenAPI (Phase 2):**
- **4 idempotent GETs**: `/products/{product_id}/variants/{variant_id}/{hpp | production-cost | gross-profit | recommended-price}`. Bare result objects, integer-IDR. No mutation → idempotency N/A.
- **recommended-price**: `margin` query param, percent, **min 0 / max 1000 / step 0.01**. Margin change → re-request this GET (re-deriving on client would violate no-client-calc).
- **needs-data has TWO distinct signals**: (a) no POS sales → **HTTP 200** + `needs_data:true` + `needs_data_reason:"NO_POS_SALES_IN_PERIOD"` (value null); (b) incomplete recipe/upstream → **HTTP 422** on all 4 endpoints. FE branches on these, never on a zero value.
- **Response keys mix EN + Indonesian** (e.g. `estimasi_laba_kotor`, `margin_persen`, `basis_perhitungan`) — must be transcribed **verbatim** in FE models; an anglicised key silently renders blank (invisible to tsc/lint).
- **No aggregate/dashboard endpoint** — dashboard is a per-variant fan-out over `/products` (lazy per-row + pagination).
- `gross-profit` + `production-cost` accept optional `date_from`/`date_to`; **v1 ships NO FE period selector** (BE-default window) — period selector deferred to a later ticket.

**Why:** Loonas's differentiator vs a plain cashier — merchant sees if their price is profitable. Ubaya Spekkoek reference case: Rp 23.7M fixed, Rp 42.5M variable, 120 units, @ Rp 650K/unit (for validating rendered numbers, not the calc).

**How to apply:** LNS-32 (BEP) and LNS-51 (monthly closing) consume the SAME LNS-42 HPP output downstream — cross-reference this contract when they come up. Verbatim EN+ID response-key transcription is the top FE correctness risk. See [[project_accounting_be_done_fe_gap]].
