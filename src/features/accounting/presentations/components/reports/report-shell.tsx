"use client";

import { ReportControlsRow } from "@/features/accounting/presentations/components/reports/report-controls-row";
import { ReportImbalanceBanner } from "@/features/accounting/presentations/components/reports/report-imbalance-banner";
import { ReportShellLoading } from "@/features/accounting/presentations/components/reports/report-shell-loading";
import { ReportShellEmpty } from "@/features/accounting/presentations/components/reports/report-shell-empty";
import { ReportShellError } from "@/features/accounting/presentations/components/reports/report-shell-error";
import { ReportShellSuccess } from "@/features/accounting/presentations/components/reports/report-shell-success";
import { ReportShellProps } from "@/features/accounting/presentations/types/report-shell.types";

export function ReportShell(props: ReportShellProps) {
  const { title, subtitle, imbalance, state, onRetry, children, headerAction, tabStrip, controlsSlot } = props;

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
      <div>
        <h1 className="text-3xl font-bold leading-9 tracking-tight">{title}</h1>
        {subtitle && <p className="leading-6 text-neutral-300">{subtitle}</p>}
      </div>

      <ReportControlsRow {...dateProps} controlsSlot={controlsSlot} />

      {showBanner && <ReportImbalanceBanner imbalance={imbalance} />}

      {tabStrip && <div className="flex flex-col gap-y-6">{tabStrip}</div>}

      <div aria-busy={state === "loading"}>
        {state === "loading" && <ReportShellLoading title={title} />}
        {state === "empty" && <ReportShellEmpty title={title} />}
        {state === "error" && <ReportShellError title={title} onRetry={onRetry} />}
        {state === "success" && (
          <ReportShellSuccess title={title} headerAction={headerAction}>
            {children}
          </ReportShellSuccess>
        )}
      </div>
    </div>
  );
}
