"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { AccountSettingAuditEntity } from "@/features/accounting/domain/entities/account-setting-audit";
import {
  CHANGED_FIELD_LABELS,
  LEGAL_FORM_LABELS,
  NPWP_CLASSIFICATION_LABELS,
  formatBooleanValue,
  capitalizeRole,
} from "@/features/accounting/presentations/helpers/tax-posture-labels";
import { LegalForm } from "@/features/accounting/domain/enums/legal-form";

type TaxPostureHistoryRowProps = {
  audit: AccountSettingAuditEntity;
};

type FieldEntry = {
  fieldKey: string;
  label: string;
  prior: unknown;
  next: unknown;
};

function formatFieldValue(fieldKey: string, value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <em className="not-italic text-neutral-200">Belum diatur</em>;
  }
  if (fieldKey === "legal_form" && typeof value === "string" && value in LEGAL_FORM_LABELS) {
    return LEGAL_FORM_LABELS[value as LegalForm];
  }
  if (fieldKey === "is_pph_final_umkm" || fieldKey === "is_pkp") {
    return formatBooleanValue(value);
  }
  if (
    fieldKey === "pkp_effective_date" ||
    fieldKey === "pph_final_eligibility_start"
  ) {
    const dt = DateTime.fromISO(String(value));
    if (dt.isValid) return dt.setLocale("id").toFormat("dd MMM yyyy");
    return String(value);
  }
  return String(value);
}

export function TaxPostureHistoryRow({ audit }: TaxPostureHistoryRowProps) {
  const displayTime = useMemo(
    () =>
      DateTime.fromJSDate(audit.createdAt)
        .setLocale("id")
        .toFormat("dd MMM yyyy, HH:mm"),
    [audit.createdAt],
  );

  const roleLabel = useMemo(() => capitalizeRole(audit.actorRole), [audit.actorRole]);

  const fieldEntries = useMemo<FieldEntry[]>(
    () =>
      Object.entries(audit.changedFields).map(([key, { prior, next }]) => ({
        fieldKey: key,
        label: CHANGED_FIELD_LABELS[key] ?? key,
        prior,
        next,
      })),
    [audit.changedFields],
  );

  return (
    <div className="flex flex-col gap-y-3 border-b border-neutral-100 px-6 py-4 last:border-b-0 hover:bg-neutral-50/40 transition-colors">
      {/* Zone 1: timestamp + role */}
      <div className="flex items-center justify-between">
        <time dateTime={audit.createdAt.toISOString()} className="text-sm text-neutral-400">
          {displayTime}
        </time>
        <div aria-label={`Diubah oleh: ${roleLabel}`}>
          <StatusChip variant="neutral" label={roleLabel} compact />
        </div>
      </div>

      {/* Zone 2: changed fields */}
      {fieldEntries.length > 0 && (
        <div className="-mx-6 mt-1 overflow-x-auto px-6">
          <div className="flex min-w-[420px] flex-col gap-y-2">
            {fieldEntries.map((entry) => {
              const showNpwpChip =
                entry.fieldKey === "npwp" &&
                audit.npwpClassification != null &&
                NPWP_CLASSIFICATION_LABELS[audit.npwpClassification];
              const chipConfig = showNpwpChip ? NPWP_CLASSIFICATION_LABELS[audit.npwpClassification!] : null;

              return (
                <div
                  key={entry.fieldKey}
                  className="grid grid-cols-[minmax(140px,_1.5fr)_1fr_20px_1fr] items-baseline gap-x-3"
                >
                  <span className="text-sm font-medium text-neutral-500">{entry.label}</span>
                  <span className="text-sm text-neutral-300">{formatFieldValue(entry.fieldKey, entry.prior)}</span>
                  <span>
                    <span aria-hidden="true" className="text-xs text-neutral-200">→</span>
                    <span className="sr-only">diubah menjadi</span>
                  </span>
                  <span className="text-sm font-semibold text-neutral-500">
                    {formatFieldValue(entry.fieldKey, entry.next)}
                    {chipConfig && (
                      <span className="ml-2 inline-flex">
                        <StatusChip variant={chipConfig.variant} label={chipConfig.label} compact />
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
