"use client";

import { ReportShell } from "@/features/accounting/presentations/components/reports/report-shell";
import { ReportsTabStrip } from "@/features/accounting/presentations/components/reports/reports-tab-strip";
import { BalanceSheetViewer } from "@/features/accounting/presentations/components/reports/balance-sheet-viewer";
import { BalanceSheetEmptyBody } from "@/app/(authenticated)/accounting/reports/_components/balance-sheet-empty-body";
import { useBalanceSheetProvider } from "@/app/(authenticated)/accounting/reports/_providers/balance-sheet-provider";
import { formatStatementAsOfLabel } from "@/features/accounting/presentations/helpers/statement-period";

// Adapter component: translates BalanceSheetProvider context to ReportShell props.
// ReportShell is shared infrastructure with a fixed prop contract — it cannot
// consume page context. This is not the deprecated *-impl.tsx monolith pattern;
// it owns zero fetch logic and zero rendering decisions. See LNS-373 arch review.
export function BalanceSheetImpl({ onTabChange }: { onTabChange?: (id: string) => void }) {
  const { dateValue, onDateChange, shellState, imbalance, report, onRetry } = useBalanceSheetProvider();

  return (
    <div role="tabpanel" id="panel-balance-sheet" aria-labelledby="tab-balance-sheet" tabIndex={0}>
      <ReportShell
        title="Laporan Posisi Keuangan (Neraca)"
        periodLabel={formatStatementAsOfLabel(dateValue)}
        explainer="Menampilkan harta, utang, dan modal bisnis Anda pada satu tanggal tertentu."
        dateMode="as-of"
        dateValue={dateValue}
        onDateChange={onDateChange}
        imbalance={imbalance}
        state={shellState === "empty" ? "success" : shellState}
        onRetry={onRetry}
        tabStrip={<ReportsTabStrip activeTab="balance-sheet" onTabChange={onTabChange} />}
      >
        {shellState === "empty" ? <BalanceSheetEmptyBody /> : report ? <BalanceSheetViewer report={report} /> : null}
      </ReportShell>
    </div>
  );
}
