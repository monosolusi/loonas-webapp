"use client";

import { ReportControlsRow } from "@/features/accounting/presentations/components/reports/report-controls-row";
import { ReportImbalanceBanner } from "@/features/accounting/presentations/components/reports/report-imbalance-banner";
import { ReportShellLoading } from "@/features/accounting/presentations/components/reports/report-shell-loading";
import { ReportShellEmpty } from "@/features/accounting/presentations/components/reports/report-shell-empty";
import { ReportShellError } from "@/features/accounting/presentations/components/reports/report-shell-error";
import { ReportShellSuccess } from "@/features/accounting/presentations/components/reports/report-shell-success";
import { ReportShellProps } from "@/features/accounting/presentations/types/report-shell.types";

export function ReportShell(props: ReportShellProps) {
  const {
    title,
    periodLabel,
    explainer,
    imbalance,
    state,
    onRetry,
    children,
    headerAction,
    tabStrip,
    controlsSlot,
    documentMasthead = true,
  } = props;

  const showBanner =
    imbalance !== null &&
    imbalance.isBalanced === false &&
    (state === "success" || state === "empty");

  const dateProps =
    props.dateMode === "as-of"
      ? ({ dateMode: "as-of", dateValue: props.dateValue, onDateChange: props.onDateChange } as const)
      : ({ dateMode: "range", dateValue: props.dateValue, onDateChange: props.onDateChange } as const);

  return (
    <div className="flex flex-col gap-y-6">
      {/* The chrome top-bar renders the visible "Laporan Keuangan" title; this keeps a
          single, stable page heading for assistive tech without duplicating it on screen. */}
      <h1 className="sr-only">Laporan Keuangan</h1>

      {tabStrip && (
        <div className="flex flex-col gap-y-2">
          {tabStrip}
          {explainer && <p className="text-sm leading-6 text-neutral-300">{explainer}</p>}
        </div>
      )}

      <ReportControlsRow {...dateProps} controlsSlot={controlsSlot} />

      {showBanner && <ReportImbalanceBanner imbalance={imbalance} />}

      <div aria-busy={state === "loading"}>
        {state === "loading" && <ReportShellLoading title={title} />}
        {state === "empty" && <ReportShellEmpty title={title} />}
        {state === "error" && <ReportShellError title={title} onRetry={onRetry} />}
        {state === "success" && (
          <ReportShellSuccess
            title={title}
            periodLabel={periodLabel}
            documentMasthead={documentMasthead}
            headerAction={headerAction}
          >
            {children}
          </ReportShellSuccess>
        )}
      </div>
    </div>
  );
}
