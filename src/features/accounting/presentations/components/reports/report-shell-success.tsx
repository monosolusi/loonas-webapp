import { ReactNode } from "react";
import { ReportStatementMasthead } from "@/features/accounting/presentations/components/reports/report-statement-masthead";

type ReportShellSuccessProps = {
  title: string;
  periodLabel: string;
  documentMasthead: boolean;
  headerAction?: ReactNode;
  children: ReactNode;
};

// The statement "paper": a flat white card (border, no shadow) whose header is the formal
// masthead, with the statement body below — so the card reads as one printed document.
export function ReportShellSuccess({
  title,
  periodLabel,
  documentMasthead,
  headerAction,
  children,
}: ReportShellSuccessProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {documentMasthead && (
        <ReportStatementMasthead title={title} periodLabel={periodLabel} action={headerAction} />
      )}
      {children}
    </div>
  );
}
