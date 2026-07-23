"use client";

import { ReportShell } from "@/features/accounting/presentations/components/reports/report-shell";
import { ReportRangeError } from "@/features/accounting/presentations/components/reports/report-range-error";
import { ReportsTabStrip } from "@/features/accounting/presentations/components/reports/reports-tab-strip";
import { CashFlowViewer } from "@/features/accounting/presentations/components/reports/cash-flow-viewer";
import { CashFlowEmptyBody } from "@/app/(authenticated)/accounting/reports/_components/cash-flow-empty-body";
import { useCashFlowProvider } from "@/app/(authenticated)/accounting/reports/_providers/cash-flow-provider";
import { formatStatementRangeLabel } from "@/features/accounting/presentations/helpers/statement-period";

// Adapter component: translates CashFlowProvider context to ReportShell props.
// ReportShell is shared infrastructure with a fixed prop contract — it cannot
// consume page context. This is not the deprecated *-impl.tsx monolith pattern;
// it owns zero fetch logic and zero rendering decisions. See LNS-374 arch review.
export function CashFlowImpl({ onTabChange }: { onTabChange?: (id: string) => void }) {
  const { dateValue, onRangeChange, shellState, imbalance, report, onRetry, rangeError } = useCashFlowProvider();

  return (
    <div role="tabpanel" id="panel-cash-flow" aria-labelledby="tab-cash-flow" tabIndex={0}>
      <ReportShell
        title="Laporan Arus Kas"
        periodLabel={formatStatementRangeLabel(dateValue)}
        explainer="Menampilkan uang kas yang masuk dan keluar dari bisnis Anda selama satu periode."
        dateMode="range"
        dateValue={dateValue}
        onDateChange={onRangeChange}
        imbalance={imbalance}
        state={shellState === "empty" ? "success" : shellState}
        onRetry={onRetry}
        tabStrip={<ReportsTabStrip activeTab="cash-flow" onTabChange={onTabChange} />}
      >
        {rangeError ? (
          <ReportRangeError message={rangeError} />
        ) : shellState === "empty" ? (
          <CashFlowEmptyBody />
        ) : report ? (
          <CashFlowViewer report={report} />
        ) : null}
      </ReportShell>
    </div>
  );
}
