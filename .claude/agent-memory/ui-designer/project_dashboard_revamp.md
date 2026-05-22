---
name: project-dashboard-revamp
description: LNS-227 dashboard revamp design decisions — visual grouping, accent semantics, chart x-axis, empty states, loading coordination
metadata:
  type: project
---

# Dashboard Revamp — LNS-227 (UNOFEST June 2026)

**Key decision: Two-section layout with bg-primary-50 zone for period-scoped widgets.**

Period-scoped widgets (Penjualan POS, Pendapatan Harian chart, Metode Pembayaran, Revenue tile [pending confirmation]) are wrapped in a `rounded-xl bg-primary-50 p-6` container. Point-in-time widgets (Piutang, Hutang, Arus Kas Bulan Ini, Faktur Terbaru) sit on the plain `#FAFAFA` canvas below.

An annotation line "Data di bawah difilter sesuai rentang tanggal yang dipilih." (`text-xs text-neutral-200`) sits directly under the "Periode terpilih" section heading.

**Why:** Live-demo scenario — merchant must instantly understand which numbers change when the date picker moves. Belt-and-suspenders (fill + verbal cue) over position-only.

**Accent color semantic mapping (locked):**
- `success-*` = income / positive cashflow / paid
- `error-*` = expense / negative cashflow / failed
- `primary-*` = receivable (Piutang) / earned revenue direction
- `warning-*` = payable (Hutang) — NOT error; Hutang is a liability, not a failure
- `neutral-100` = zero/no-data (chart empty bars)
- `primary-50` = period-scoped section tint

**Do NOT use `bg-emerald-50` / `text-orange-500`** — replace with `bg-success-50` / `text-success-400` (incoming) and `bg-warning-50` / `text-warning-400` (outgoing) in recent-invoices rows.

**Chart x-axis rule:**
- 2–7 days: every tick, single row, `ccc d` (e.g. "Sen 2")
- 8–14 days: every tick, date only (`d`), first/last anchored with `d MMM`
- 15–31 days: every ~3rd day, `d MMM`, ~10 ticks max
- Single day: centered single tick or text fallback — EL to confirm

Two-row CustomXAxisTick abolished for all ranges > 1 day. Chart bottom margin shrinks from 28 to 16.

**Empty-state pattern:**
- Fixed footprint (same height as populated state) — no collapse
- Centered icon (Heroicons outline, `text-neutral-100`) + single message line (`text-sm text-neutral-200`)
- No illustration, no CTA (CPO decides copy tone)
- Never show `Rp 0` or `dari 0 faktur` — empty state replaces numeric content entirely

**Loading coordination:**
- Per-widget animate-pulse skeletons, synchronized via `data-loading` attribute on the period-scoped wrapper
- Stale-while-revalidate: reduced opacity (`opacity-60`) on populated widgets while revalidating, full skeletons on initial load

**Tooltip rule:**
- All bars (including zero) show tooltip on hover
- Zero-bar tooltip: "Belum ada penjualan" instead of "Rp 0"
- Non-zero: amount + transaction count

**Open structural question:**
Revenue tile in DashboardStatistics (month-to-date) vs. period-scoped Revenue tile — are these the same widget? PM + EL must confirm. If same, DashboardStatistics becomes 2-up (Piutang + Hutang only).

**How to apply:** Reference this when working on any `/home` dashboard component. The visual grouping, accent mapping, and empty-state pattern are locked design decisions — do not deviate without a PRD update.
