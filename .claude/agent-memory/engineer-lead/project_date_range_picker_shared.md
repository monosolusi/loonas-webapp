---
name: date-range-picker-shared
description: Two DateRangePicker files exist (core + finance), each with one caller — do not assume they share an API
metadata:
  type: project
---

As of 2026-05-22 there are **two parallel DateRangePicker components**, not one:

1. `src/core/presentations/components/date-range-picker.tsx` — consumed by `home/_components/dashboard-range-section.tsx` (LNS-230 dashboard). Supports `disableFutureDates` prop, has mobile `<Dialog>` branch, uses `anchor={{ to: "bottom end", gap: 8 }}` for portaled positioning.
2. `src/app/(authenticated)/finance/_components/date-range-picker.tsx` — consumed by `finance/ledger/[accountId]/_components/ledger-detail-impl.tsx`. Inline-positioned panel (no portal), hardcoded `disabled={{ after: today }}`, no mobile branch.

**Why:** The dashboard picker was forked rather than reused because the home use case needs (a) future-date selection allowed, (b) mobile bottom-sheet, (c) different preset list ("Bulan ini" / 7/14/30 days). Promoting one to a single source of truth was out of scope for LNS-230.

**How to apply:**
- Before mutating either picker's API, `grep -rn 'DateRangePicker' src --include='*.tsx'` to enumerate callers per file.
- If a third caller lands, that's the trigger to unify — consolidate into `core/` with feature props (`disableFutureDates`, `presets`, `mobile`).
- The core picker is the canonical pattern for new work — it correctly portals via Headless UI `anchor`, escaping the [[authenticated-chrome-clipping]] overflow chain.
