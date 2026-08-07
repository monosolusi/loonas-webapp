---
name: report-shell-discriminator-without-chrome
description: Adopting the ReportShellState discriminator WITHOUT routing through ReportShell chrome is acceptable when the page is not one of the 6 financial-statement tabs
metadata:
  type: feedback
---

When a report page adopts the `ReportShellState` discriminator (`loading|error|empty|success`) in its provider and splits each state into its own component, it does NOT also have to route the state through the shared `ReportShell` chrome component — **provided the page is not one of the 6 financial-statement tabs**. The discriminator adoption is the load-bearing structural fix (single state enum → eliminates hand-rolled error classification and the dead-retry bug class); the `ReportShell` chrome is a presentation-consistency concern, not a Clean-Architecture concern.

**Why:** `ReportShell` renders `<h1 className="sr-only">Laporan Keuangan</h1>` (a single stable page heading for the tab group) plus `ReportControlsRow`, an imbalance banner, and a `tabStrip` slot. For a standalone working-paper route that already renders `ListPageHeader` (which emits its own visible `<h1>`), adopting `ReportShell` would produce two h1s (an a11y regression) and import inapplicable chrome. The buku-besar precedent uses `documentMasthead={false}` BUT buku-besar IS a financial-statement tab, so its sr-only "Laporan Keuangan" h1 is semantically correct there — that does NOT extend to non-tab working papers. Found in LNS-640 cost-valuation-gaps.

**How to apply:** When a report under `/accounting/reports/*` is a standalone route (not a tab in `ReportsTabStrip`) and carries its own `ListPageHeader`, accept discriminator-only adoption. Reserve the "must also use ReportShell" push for pages that ARE part of the financial-statement tab group. If more non-tab working papers emerge, suggest refactoring `ReportShell` to be chrome-optional (parameterize the sr-only h1 and tabStrip) rather than forking the state-split pattern — but that is a follow-up, not a blocker. Links: [[project_lns640_review_learnings]].