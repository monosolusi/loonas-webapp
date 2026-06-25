---
name: project-lns379-opening-balance-wizard
description: LNS-379 opening balance wizard implementation — key patterns and decisions
metadata:
  type: project
---

LNS-379 shipped the opening balance wizard (multi-step, non-accountant-facing). Key decisions:

**Model drift fix (load-bearing):** `LedgerAccountModel.fromJson` was reading `data["parent_id"]` but the live API returns nested `data["parent"]["id"]`. Fixed to `data["parent"]?.["id"] ?? null`. Header account derivation (deriveHeaderAccountIds) depends on this.

**3200 retained earnings:** FE computes and sends the balancing 3200 line — BE does NOT derive it. `computeRetainedEarningsLine()` in presentations/helpers does integer arithmetic. `residual > 0` → 3200 credit; `residual < 0` → 3200 debit (deficit, BE returns 422 → AccumulatedDeficitBlock).

**Tri-state GET hook:** `use-get-opening-balance.ts` swallows errors to null (for Laba Rugi advisory). The wizard uses a dedicated fetcher (`GetOpeningBalanceWizardFetcher`) that throws on DataFailed, giving tri-state: entity / null / error.

**Idempotency key:** `idempotencyKeyRef = useRef(crypto.randomUUID())` in provider, reused across retries, rotated only on terminal error. Sent via `config.headers["Idempotency-Key"]`.

**POST response:** Returns bare JournalEntry (201) → `JournalModel.fromJson(result)` directly (not JournalWriteResultModel).

**Balance gate:** Owner-facing Step 3 gate is `hasAnyNonZeroInput` (≥1 non-zero amount), NOT raw debit==credit, because post-3200-injection the payload is always balanced by construction.

**Responsive:** Screen 3 balance indicator uses conditional render (`role="status" aria-live="polite"`) not CSS toggling, to avoid double aria-live announcements (LNS-364 class bug).

**Why:** Permanent setup, irreversible. Non-accountant UMKM owners.
**How to apply:** If extending the wizard, respect the 3200 balancing logic in the provider and never show Debit/Kredit jargon in owner-facing copy.
