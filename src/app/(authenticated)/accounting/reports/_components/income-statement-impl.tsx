"use client";

import { ReportShell } from "@/features/accounting/presentations/components/reports/report-shell";
import { ReportRangeError } from "@/features/accounting/presentations/components/reports/report-range-error";
import { ReportsTabStrip } from "@/features/accounting/presentations/components/reports/reports-tab-strip";
import { ComparePeriodControl } from "@/features/accounting/presentations/components/reports/compare-period-control";
import { IncomeStatementViewer } from "@/features/accounting/presentations/components/reports/income-statement-viewer";
import { IncomeStatementMigrationNotice } from "@/features/accounting/presentations/components/reports/income-statement-migration-notice";
import { IncomeStatementEmptyBody } from "@/app/(authenticated)/accounting/reports/_components/income-statement-empty-body";
import { useIncomeStatementProvider } from "@/app/(authenticated)/accounting/reports/_providers/income-statement-provider";
import { useGetOpeningBalance } from "@/features/accounting/presentations/hooks/use-get-opening-balance";
import { formatStatementRangeLabel } from "@/features/accounting/presentations/helpers/statement-period";

// Adapter component: translates IncomeStatementProvider context to ReportShell props.
// ReportShell is shared infrastructure with a fixed prop contract — it cannot
// consume page context. This is not the deprecated *-impl.tsx monolith pattern;
// it owns zero fetch logic and zero rendering decisions. See LNS-374 arch review.
export function IncomeStatementImpl({ onTabChange }: { onTabChange?: (id: string) => void }) {
  const { dateValue, onRangeChange, compareRange, onCompareChange, shellState, imbalance, report, onRetry, rangeError } =
    useIncomeStatementProvider();
  const { isMigration, loading: migrationLoading } = useGetOpeningBalance();

  return (
    <div role="tabpanel" id="panel-income-statement" aria-labelledby="tab-income-statement" tabIndex={0}>
      <ReportShell
        title="Laporan Laba Rugi"
        periodLabel={formatStatementRangeLabel(dateValue)}
        explainer="Menampilkan pendapatan, biaya, dan laba bersih bisnis Anda selama satu periode."
        dateMode="range"
        dateValue={dateValue}
        onDateChange={onRangeChange}
        imbalance={imbalance}
        state={shellState === "empty" ? "success" : shellState}
        onRetry={onRetry}
        controlsSlot={<ComparePeriodControl compareRange={compareRange} onCompareChange={onCompareChange} />}
        tabStrip={<ReportsTabStrip activeTab="income-statement" onTabChange={onTabChange} />}
      >
        {rangeError ? (
          <ReportRangeError message={rangeError} />
        ) : shellState === "empty" ? (
          <IncomeStatementEmptyBody />
        ) : report ? (
          <>
            {!migrationLoading && isMigration && <IncomeStatementMigrationNotice />}
            <IncomeStatementViewer report={report} />
          </>
        ) : null}
      </ReportShell>
    </div>
  );
}
