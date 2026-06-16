"use client";

import { ReportShell } from "@/features/accounting/presentations/components/reports/report-shell";
import { ReportRangeError } from "@/features/accounting/presentations/components/reports/report-range-error";
import { ReportsTabStrip } from "@/features/accounting/presentations/components/reports/reports-tab-strip";
import { ArusKasViewer } from "@/features/accounting/presentations/components/reports/arus-kas-viewer";
import { ArusKasEmptyBody } from "@/app/(authenticated)/finance/reports/_components/arus-kas-empty-body";
import { useArusKasProvider } from "@/app/(authenticated)/finance/reports/_providers/arus-kas-provider";

// Adapter component: translates ArusKasProvider context to ReportShell props.
// ReportShell is shared infrastructure with a fixed prop contract — it cannot
// consume page context. This is not the deprecated *-impl.tsx monolith pattern;
// it owns zero fetch logic and zero rendering decisions. See LNS-374 arch review.
export function ArusKasImpl({ onTabChange }: { onTabChange?: (id: string) => void }) {
  const { dateValue, onRangeChange, shellState, imbalance, report, onRetry, rangeError } = useArusKasProvider();

  return (
    <div role="tabpanel" id="panel-arus-kas" aria-labelledby="tab-arus-kas" tabIndex={0}>
      <ReportShell
        title="Arus Kas"
        dateMode="range"
        dateValue={dateValue}
        onDateChange={onRangeChange}
        imbalance={imbalance}
        state={shellState === "empty" ? "success" : shellState}
        onRetry={onRetry}
        tabStrip={<ReportsTabStrip activeTab="arus-kas" onTabChange={onTabChange} />}
      >
        {rangeError ? (
          <ReportRangeError message={rangeError} />
        ) : shellState === "empty" ? (
          <ArusKasEmptyBody />
        ) : report ? (
          <ArusKasViewer report={report} />
        ) : null}
      </ReportShell>
    </div>
  );
}
