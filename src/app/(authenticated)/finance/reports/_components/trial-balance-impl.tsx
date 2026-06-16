"use client";

import { ReportShell } from "@/features/accounting/presentations/components/reports/report-shell";
import { ReportsTabStrip } from "@/features/accounting/presentations/components/reports/reports-tab-strip";
import { IncludeZeroToggle } from "@/features/accounting/presentations/components/reports/include-zero-toggle";
import { NeracaSaldoViewer } from "@/features/accounting/presentations/components/reports/neraca-saldo-viewer";
import { NeracaSaldoEmptyBody } from "@/app/(authenticated)/finance/reports/_components/neraca-saldo-empty-body";
import { useTrialBalanceProvider } from "@/app/(authenticated)/finance/reports/_providers/trial-balance-provider";

// Adapter component: translates TrialBalanceProvider context to ReportShell props.
// ReportShell is shared infrastructure with a fixed prop contract — it cannot
// consume page context. This is not the deprecated *-impl.tsx monolith pattern;
// it owns zero fetch logic and zero rendering decisions. See LNS-375 arch review.
export function TrialBalanceImpl({ onTabChange }: { onTabChange?: (id: string) => void }) {
  const {
    dateValue,
    onDateChange,
    shellState,
    imbalance,
    report,
    expandedAccountId,
    onToggleExpand,
    includeZero,
    onToggleIncludeZero,
    onRetry,
  } = useTrialBalanceProvider();

  return (
    <div role="tabpanel" id="panel-trial-balance" aria-labelledby="tab-trial-balance" tabIndex={0}>
      <ReportShell
        title="Neraca Saldo"
        dateMode="as-of"
        dateValue={dateValue}
        onDateChange={onDateChange}
        imbalance={imbalance}
        state={shellState === "empty" ? "success" : shellState}
        onRetry={onRetry}
        controlsSlot={<IncludeZeroToggle active={includeZero} onToggle={onToggleIncludeZero} />}
        tabStrip={<ReportsTabStrip activeTab="trial-balance" onTabChange={onTabChange} />}
      >
        {shellState === "empty" ? (
          <NeracaSaldoEmptyBody />
        ) : report ? (
          <NeracaSaldoViewer
            report={report}
            expandedAccountId={expandedAccountId}
            onToggleExpand={onToggleExpand}
          />
        ) : null}
      </ReportShell>
    </div>
  );
}
