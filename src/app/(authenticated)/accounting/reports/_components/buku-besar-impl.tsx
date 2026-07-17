"use client";

import { ReportShell } from "@/features/accounting/presentations/components/reports/report-shell";
import { ReportsTabStrip } from "@/features/accounting/presentations/components/reports/reports-tab-strip";
import { BukuBesarViewer } from "@/features/accounting/presentations/components/reports/buku-besar-viewer";
import { useBukuBesarProvider } from "@/app/(authenticated)/accounting/reports/_providers/buku-besar-provider";
import { formatStatementRangeLabel } from "@/features/accounting/presentations/helpers/statement-period";

// Adapter component: translates BukuBesarProvider context to ReportShell props.
// ReportShell is shared infrastructure with a fixed prop contract — it cannot
// consume page context. This is not the deprecated *-impl.tsx monolith pattern;
// it owns zero fetch logic and zero rendering decisions. See LNS-375 arch review.
export function BukuBesarImpl({ onTabChange }: { onTabChange?: (id: string) => void }) {
  const {
    account,
    onAccountChange,
    dateRange,
    onRangeChange,
    shellState,
    report,
    summary,
    counterpartMap,
    meta,
    page,
    onPageChange,
    pageError,
    onRetry,
  } = useBukuBesarProvider();

  return (
    <div role="tabpanel" id="panel-buku-besar" aria-labelledby="tab-buku-besar" tabIndex={0}>
      <ReportShell
        title="Buku Besar"
        periodLabel={formatStatementRangeLabel(dateRange)}
        explainer="Rincian seluruh transaksi per akun beserta saldo berjalannya."
        documentMasthead={false}
        dateMode="range"
        dateValue={dateRange}
        onDateChange={onRangeChange}
        imbalance={null}
        state={shellState}
        onRetry={onRetry}
        tabStrip={<ReportsTabStrip activeTab="buku-besar" onTabChange={onTabChange} />}
      >
        <BukuBesarViewer
          account={account}
          onAccountChange={onAccountChange}
          report={report}
          summary={summary}
          counterpartMap={counterpartMap}
          meta={meta}
          page={page}
          onPageChange={onPageChange}
          isInitialLoading={shellState === "loading"}
          pageError={pageError}
          onRetry={onRetry}
        />
      </ReportShell>
    </div>
  );
}
