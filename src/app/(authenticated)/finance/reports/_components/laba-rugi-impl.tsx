"use client";

import { ReportShell } from "@/features/accounting/presentations/components/reports/report-shell";
import { ReportRangeError } from "@/features/accounting/presentations/components/reports/report-range-error";
import { ReportsTabStrip } from "@/features/accounting/presentations/components/reports/reports-tab-strip";
import { ComparePeriodControl } from "@/features/accounting/presentations/components/reports/compare-period-control";
import { LabaRugiViewer } from "@/features/accounting/presentations/components/reports/laba-rugi-viewer";
import { LabaRugiMigrationNotice } from "@/features/accounting/presentations/components/reports/laba-rugi-migration-notice";
import { LabaRugiEmptyBody } from "@/app/(authenticated)/finance/reports/_components/laba-rugi-empty-body";
import { useLabaRugiProvider } from "@/app/(authenticated)/finance/reports/_providers/laba-rugi-provider";
import { useGetOpeningBalance } from "@/features/accounting/presentations/hooks/use-get-opening-balance";

// Adapter component: translates LabaRugiProvider context to ReportShell props.
// ReportShell is shared infrastructure with a fixed prop contract — it cannot
// consume page context. This is not the deprecated *-impl.tsx monolith pattern;
// it owns zero fetch logic and zero rendering decisions. See LNS-374 arch review.
export function LabaRugiImpl({ onTabChange }: { onTabChange?: (id: string) => void }) {
  const { dateValue, onRangeChange, compareRange, onCompareChange, shellState, imbalance, report, onRetry, rangeError } =
    useLabaRugiProvider();
  const { isMigration, loading: migrationLoading } = useGetOpeningBalance();

  return (
    <div role="tabpanel" id="panel-laba-rugi" aria-labelledby="tab-laba-rugi" tabIndex={0}>
      <ReportShell
        title="Laba Rugi"
        dateMode="range"
        dateValue={dateValue}
        onDateChange={onRangeChange}
        imbalance={imbalance}
        state={shellState === "empty" ? "success" : shellState}
        onRetry={onRetry}
        controlsSlot={<ComparePeriodControl compareRange={compareRange} onCompareChange={onCompareChange} />}
        tabStrip={<ReportsTabStrip activeTab="laba-rugi" onTabChange={onTabChange} />}
      >
        {rangeError ? (
          <ReportRangeError message={rangeError} />
        ) : shellState === "empty" ? (
          <LabaRugiEmptyBody />
        ) : report ? (
          <>
            {!migrationLoading && isMigration && <LabaRugiMigrationNotice />}
            <LabaRugiViewer report={report} />
          </>
        ) : null}
      </ReportShell>
    </div>
  );
}
