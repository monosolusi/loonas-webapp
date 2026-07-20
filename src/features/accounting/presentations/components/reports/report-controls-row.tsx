"use client";

import { ReactNode } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { AsOfDatePicker } from "@/features/accounting/presentations/components/as-of-date-picker";
import { ReportShellDateProps } from "@/features/accounting/presentations/types/report-shell.types";

type ReportControlsRowProps = ReportShellDateProps & {
  readonly controlsSlot?: ReactNode;
};

export function ReportControlsRow(props: ReportControlsRowProps) {
  return (
    <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between sm:gap-y-0">
      <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:gap-x-3">
        <div className="w-full sm:w-auto">
          {props.dateMode === "as-of" ? (
            <AsOfDatePicker value={props.dateValue} onChange={props.onDateChange} />
          ) : (
            <DateRangePicker value={props.dateValue} onChange={props.onDateChange} />
          )}
        </div>
        {props.controlsSlot && <div className="w-full sm:w-auto">{props.controlsSlot}</div>}
      </div>

      <button
        type="button"
        disabled
        aria-disabled="true"
        aria-label="Ekspor laporan — segera hadir"
        title="Segera hadir"
        className={clsx(
          "flex w-full flex-row items-center justify-center gap-x-2 rounded-lg border border-neutral-100 bg-neutral-50 px-4 text-sm font-medium text-neutral-200",
          "h-11 cursor-not-allowed sm:w-auto",
        )}
      >
        <ArrowDownTrayIcon className="size-4 text-neutral-200" aria-hidden="true" />
        <span>Ekspor</span>
      </button>
    </div>
  );
}
