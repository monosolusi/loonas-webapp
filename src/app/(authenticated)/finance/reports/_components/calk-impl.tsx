"use client";

import { ReportShell } from "@/features/accounting/presentations/components/reports/report-shell";
import { ReportsTabStrip } from "@/features/accounting/presentations/components/reports/reports-tab-strip";
import { CalkViewer } from "@/features/accounting/presentations/components/reports/calk-viewer";
import { CalkEmptyBody } from "@/app/(authenticated)/finance/reports/_components/calk-empty-body";
import { useCalkProvider } from "@/app/(authenticated)/finance/reports/_providers/calk-provider";

// Adapter component: translates CalkProvider context to ReportShell props.
// ReportShell is shared infrastructure with a fixed prop contract — it cannot
// consume page context. This is not the deprecated *-impl.tsx monolith pattern;
// it owns zero fetch logic and zero rendering decisions.
export function CalkImpl({ onTabChange }: { onTabChange?: (id: string) => void }) {
  const { dateValue, onDateChange, shellState, report, onRetry } = useCalkProvider();

  return (
    <div role="tabpanel" id="panel-calk" aria-labelledby="tab-calk" tabIndex={0}>
      <ReportShell
        title="Catatan atas Laporan Keuangan"
        subtitle="Catatan atas laporan keuangan sesuai SAK EMKM."
        dateMode="as-of"
        dateValue={dateValue}
        onDateChange={onDateChange}
        imbalance={null}
        state={shellState === "empty" ? "success" : shellState}
        onRetry={onRetry}
        tabStrip={<ReportsTabStrip activeTab="calk" onTabChange={onTabChange} />}
      >
        {shellState === "empty" ? <CalkEmptyBody /> : report ? <CalkViewer report={report} /> : null}
      </ReportShell>
    </div>
  );
}
