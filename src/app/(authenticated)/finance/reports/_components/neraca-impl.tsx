"use client";

import { ReportShell } from "@/features/accounting/presentations/components/reports/report-shell";
import { ReportsTabStrip } from "@/features/accounting/presentations/components/reports/reports-tab-strip";
import { NeracaViewer } from "@/features/accounting/presentations/components/reports/neraca-viewer";
import { NeracaEmptyBody } from "@/app/(authenticated)/finance/reports/_components/neraca-empty-body";
import { useNeracaProvider } from "@/app/(authenticated)/finance/reports/_providers/neraca-provider";

// Adapter component: translates NeracaProvider context to ReportShell props.
// ReportShell is shared infrastructure with a fixed prop contract — it cannot
// consume page context. This is not the deprecated *-impl.tsx monolith pattern;
// it owns zero fetch logic and zero rendering decisions. See LNS-373 arch review.
export function NeracaImpl({ onTabChange }: { onTabChange?: (id: string) => void }) {
  const { dateValue, onDateChange, shellState, imbalance, report, onRetry } = useNeracaProvider();

  return (
    <div role="tabpanel" id="panel-neraca" aria-labelledby="tab-neraca" tabIndex={0}>
      <ReportShell
        title="Neraca"
        subtitle="Laporan neraca per tanggal yang dipilih."
        dateMode="as-of"
        dateValue={dateValue}
        onDateChange={onDateChange}
        imbalance={imbalance}
        state={shellState === "empty" ? "success" : shellState}
        onRetry={onRetry}
        tabStrip={<ReportsTabStrip activeTab="neraca" onTabChange={onTabChange} />}
      >
        {shellState === "empty" ? <NeracaEmptyBody /> : report ? <NeracaViewer report={report} /> : null}
      </ReportShell>
    </div>
  );
}
