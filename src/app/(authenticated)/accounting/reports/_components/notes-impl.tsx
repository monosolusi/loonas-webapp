"use client";

import { ReportShell } from "@/features/accounting/presentations/components/reports/report-shell";
import { ReportsTabStrip } from "@/features/accounting/presentations/components/reports/reports-tab-strip";
import { NotesViewer } from "@/features/accounting/presentations/components/reports/notes-viewer";
import { NotesEmptyBody } from "@/app/(authenticated)/accounting/reports/_components/notes-empty-body";
import { useNotesProvider } from "@/app/(authenticated)/accounting/reports/_providers/notes-provider";
import { formatStatementAsOfLabel } from "@/features/accounting/presentations/helpers/statement-period";

// Adapter component: translates NotesProvider context to ReportShell props.
// ReportShell is shared infrastructure with a fixed prop contract — it cannot
// consume page context. This is not the deprecated *-impl.tsx monolith pattern;
// it owns zero fetch logic and zero rendering decisions.
export function NotesImpl({ onTabChange }: { onTabChange?: (id: string) => void }) {
  const { dateValue, onDateChange, shellState, report, onRetry } = useNotesProvider();

  return (
    <div role="tabpanel" id="panel-notes" aria-labelledby="tab-notes" tabIndex={0}>
      <ReportShell
        title="Catatan atas Laporan Keuangan"
        periodLabel={formatStatementAsOfLabel(dateValue)}
        explainer="Penjelasan rinci dan kebijakan akuntansi yang mendasari laporan keuangan (SAK EMKM)."
        dateMode="as-of"
        dateValue={dateValue}
        onDateChange={onDateChange}
        imbalance={null}
        state={shellState === "empty" ? "success" : shellState}
        onRetry={onRetry}
        tabStrip={<ReportsTabStrip activeTab="notes" onTabChange={onTabChange} />}
      >
        {shellState === "empty" ? <NotesEmptyBody /> : report ? <NotesViewer report={report} /> : null}
      </ReportShell>
    </div>
  );
}
