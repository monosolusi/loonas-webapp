---
name: project-laba-rugi-arus-kas-spec
description: LNS-374 design decisions for Laba Rugi and Arus Kas report viewers — comparison column, non-cash disclosure, imbalance banner, range default, empty state copy
metadata:
  type: project
---

LNS-374 — Laba Rugi + Arus Kas viewers. Key design decisions locked:

- **Range control**: reuse existing `DateRangePicker` (dateMode="range") — no new control. Default range: current month ("Bulan ini" preset). Inverted range: DateRangePicker already prevents from > to via DayPicker's selection model; no extra validation needed.
- **Laba Rugi comparison column**: shown when compare period is set (controlsSlot). Missing/empty compare data → dash "—" displayed with `text-neutral-200` (not zero). Hidden column if compare period is not set (single-column mode).
- **Arus Kas non-cash disclosure**: rendered below the main table as a `<section aria-label="Transaksi Non-Kas">` disclosure block with a hairline separator — not inside the table. Each item is a two-column row (description / amount).
- **Imbalance banner**: reuse existing `ReportImbalanceBanner` unchanged. No new component needed.
- **Empty state**: bespoke per viewer (not generic shell), rendered as the child slot when shellState === "empty". Component naming: `LabaRugiEmptyBody` and `ArusKasEmptyBody`.
- **Tab strip**: both tabs were `disabled: true` in ReportsTabStrip — need enabling once viewers ship. `activeTab` union type in `ReportsTabStripProps` also needs widening to include "laba-rugi" | "arus-kas".

**Why:** per DESIGN.md Calm Ledger — no new controls, reuse family pattern established by Neraca, TB, GL.
**How to apply:** SWE must widen ReportsTabStrip's activeTab type and set disabled:false for both tabs.
