"use client";

import clsx from "clsx";
import { InformationCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { WarningEntryEntity } from "@/features/accounting/domain/entities/warning-entry";
import { WarningSeverity } from "@/features/accounting/domain/enums/warning-severity";

const WARNING_CODE_COPY: Record<string, string> = {
  DATE_IN_CLOSED_PERIOD: "Tanggal posting berada di dalam periode yang sudah ditutup.",
  UNUSUAL_ACCOUNT_COMBINATION: "Kombinasi akun tidak biasa untuk jenis transaksi ini.",
  LARGE_AMOUNT_ANOMALY: "Jumlah transaksi ini jauh di atas rata-rata historis.",
};

type JournalWarningItemProps = {
  warning: WarningEntryEntity;
};

export function JournalWarningItem({ warning }: JournalWarningItemProps) {
  const message = WARNING_CODE_COPY[warning.code] ?? warning.code;

  const severityClasses = clsx({
    "bg-primary-50 border-primary-100": warning.severity === WarningSeverity.INFO,
    "bg-warning-50 border-warning-200": warning.severity === WarningSeverity.WARNING,
    "bg-error-50 border-error-200": warning.severity === WarningSeverity.HARD,
  });

  const IconComponent =
    warning.severity === WarningSeverity.INFO
      ? InformationCircleIcon
      : warning.severity === WarningSeverity.WARNING
        ? ExclamationTriangleIcon
        : ExclamationCircleIcon;

  const iconColorClass = clsx({
    "text-primary-400": warning.severity === WarningSeverity.INFO,
    "text-warning-400": warning.severity === WarningSeverity.WARNING,
    "text-error-400": warning.severity === WarningSeverity.HARD,
  });

  return (
    <div className={clsx("rounded-lg border px-4 py-3", severityClasses)}>
      <div className="flex flex-row gap-x-3">
        <IconComponent className={clsx("mt-0.5 size-4 shrink-0", iconColorClass)} />
        <div className="flex flex-col gap-y-1">
          <span className="text-sm font-medium">{message}</span>
          {warning.suggestedAlternative && (
            <span className="text-sm text-neutral-300">Saran: {warning.suggestedAlternative}</span>
          )}
        </div>
      </div>
    </div>
  );
}
