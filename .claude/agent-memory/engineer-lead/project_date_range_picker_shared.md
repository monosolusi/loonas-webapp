---
name: date-range-picker-shared
description: Single DateRangePicker at /finance/_components/date-range-picker.tsx — used only by ledger today; check call sites before mutating its API
metadata:
  type: project
---

`src/app/(authenticated)/finance/_components/date-range-picker.tsx` is currently consumed by exactly one caller: `/finance/ledger/[accountId]/_components/ledger-detail-impl.tsx`. Built on Popover + react-day-picker (`mode="range"`, `numberOfMonths={2}`, `max={maxSpanDays}`), with `disabled={{ after: today }}` hardcoded and Indonesian-language presets.

**Why:** It's positioned in `finance/_components/` not `core/presentations/components/` — naming implies finance-only, but it's the project's only date-range UI. New callers (e.g. LNS-193 dashboard widget) reuse it rather than fork.

**How to apply:** Before changing its API (props, hardcoded behaviours like `disabled={{ after: today }}`), run `grep -rn 'DateRangePicker' src --include='*.tsx'` to enumerate callers. Removing the `disabled` hardcode affects ledger too — flag to PM/UI before doing it. Consider promoting it to `core/presentations/components/` if a third caller lands.

The picker validates span via `react-day-picker`'s `max` prop (inclusive day count). Use `to.diff(from, "days").days + 1` to mirror that for FE pre-checks.
