---
name: project-tb-gl-report-viewers
description: LNS-375 design decisions — Trial Balance + General Ledger viewers, drill-down pattern, GL account picker
metadata:
  type: project
---

# LNS-375 — Trial Balance + General Ledger Viewer Design Decisions

**Decision: TB drill-down = inline row-expand (accordion disclosure), NOT side panel or dialog.**
Why: user must stay oriented in the TB table; a side panel breaks the spatial relationship; dialog loses context entirely.
Interaction: activating a TB account row adds a `data-expanded` disclosure region beneath it in the same table, scoped rows are revealed, collapse on re-click or Escape.

**Decision: GL summary block reuses `SummaryCard` (3-up grid variant, neutral + primary).**
Why: SummaryCard already handles loading skeleton, variant coloring, and accessibility. Bespoke header band would diverge for no gain.

**Decision: GL does NOT add a "buka di Buku Besar" deep-link.**
Why: the GL viewer inside the Reports hub is a peer surface to `/finance/ledger/{accountId}`; adding a link would confuse which surface is canonical. The PRD explicitly says "do not rebuild" the ledger pages.

**Copy decisions (Bahasa Indonesia, finalized):**
- Tab labels: "Neraca Saldo" (TB), "Buku Besar" (GL) — matches existing `reports-tab-strip.tsx` label slots
- TB columns: "Debit" / "Kredit" (right-aligned)
- TB group header: account type name uppercased (pattern from `neraca-section.tsx`)
- TB subtotal row: "Subtotal {group}" (semibold)
- TB grand-total row: "Total Debit" / "Total Kredit" (bold, `border-t-2 border-neutral-300`)
- TB include-zero toggle: "Tampilkan saldo nol" label, right of the date control in `ReportControlsRow`
- GL summary: "Saldo Awal" / "Mutasi Debit" / "Mutasi Kredit" / "Saldo Akhir" — 4-card row (not 3, to avoid summing debit/kredit into one "Mutasi")
- GL picker prompt: "Pilih akun untuk melihat Buku Besar"
- GL no-movement: "Tidak ada transaksi pada periode ini."
- TB drill empty: "Tidak ada jurnal untuk akun ini pada periode ini."
- Imbalance banner: existing `ReportImbalanceBanner` component (ExclamationTriangleIcon + warning palette) — no change needed

**Architecture implications:**
- `ReportsTabStrip` activeTab union must expand to include "trial-balance" | "buku-besar"
- `page.tsx` needs to become a tab-routing wrapper (state for active tab), no longer just wraps NeracaProvider
- TB viewer lives at `reports/_components/trial-balance-impl.tsx` + `_providers/trial-balance-provider.tsx`
- GL viewer lives at `reports/_components/buku-besar-impl.tsx` + `_providers/buku-besar-provider.tsx`
- Drill-down panel is `reports/_components/trial-balance-drill-panel.tsx` (no modal/dialog primitive needed)
- ROUTE_MAP already covers `/finance/reports` — no additional entries needed for tabs (they're in-page state)
