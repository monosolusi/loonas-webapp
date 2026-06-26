"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { DateTime } from "luxon";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { CloseWarning } from "@/features/accounting/domain/entities/close-warning";
import { NumberDisplay } from "@/core/presentations/components/number-display";

const REGIME_LABELS: Record<string, string> = { pph_final_umkm: "PPh Final UMKM" };

type PeriodAdvisoryProps = {
  periodLabel: string;
  warnings: CloseWarning[];
  onDismiss: () => void;
};

export function PeriodAdvisory({ periodLabel, warnings, onDismiss }: PeriodAdvisoryProps) {
  const firstWarning = warnings[0];
  const regimeLabel = REGIME_LABELS[firstWarning?.details?.tenantRegime ?? ""];
  const dppA = firstWarning?.details?.periodDpp ?? 0;

  const formattedDeadline = useMemo(() => {
    if (!firstWarning?.details?.setorDeadline) return "";
    return DateTime.fromISO(firstWarning.details.setorDeadline, { zone: "Asia/Jakarta" }).setLocale("id").toFormat("d LLLL yyyy");
  }, [firstWarning]);

  return (
    <div role="status" aria-live="polite" aria-atomic="false">
      <div className="border-b border-neutral-100 px-6 py-4">
        <div className={clsx("flex items-start gap-x-3 rounded-lg border px-4 py-3", "border-warning-400 bg-warning-50")}>
          <InformationCircleIcon className="size-5 shrink-0 text-warning-400" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning-500">
              Pengingat PPh Final — {periodLabel}
            </p>
            {warnings.length === 1 ? (
              <>
                <p className="mt-1 text-sm text-warning-500">
                  {firstWarning.details?.expectedAccountCode
                    ? `Periode ini berhasil ditutup. Namun, jurnal PPh Final untuk akun ${firstWarning.details.expectedAccountCode} belum diposting.`
                    : "Periode ini berhasil ditutup. Namun, jurnal PPh Final belum diposting."}
                  {formattedDeadline
                    ? ` Pastikan jurnal PPh Final diposting sebelum ${formattedDeadline}.`
                    : " Pastikan jurnal PPh Final segera diposting."}
                </p>
                {(dppA > 0 || regimeLabel) && (
                  <div className="mt-2">
                    {dppA > 0 && (
                      <p className="text-xs text-warning-500">
                        Dasar pengenaan (omzet bruto):{" "}
                        <NumberDisplay value={dppA} prefix="Rp" />
                      </p>
                    )}
                    {regimeLabel && <p className="text-xs text-warning-500">Skema pajak: {regimeLabel}</p>}
                  </div>
                )}
              </>
            ) : (
              <>
                <ul className="mt-1 list-disc pl-4 text-sm text-warning-500">
                  {warnings.map((w, i) => {
                    const deadline = w.details?.setorDeadline
                      ? DateTime.fromISO(w.details.setorDeadline, { zone: "Asia/Jakarta" }).setLocale("id").toFormat("d LLLL yyyy")
                      : "";
                    return (
                      <li key={i}>
                        {w.details?.expectedAccountCode
                          ? `Jurnal PPh Final untuk akun ${w.details.expectedAccountCode} belum diposting.`
                          : "Jurnal PPh Final belum diposting."}
                        {deadline ? ` Sebelum ${deadline}.` : ""}
                        {(w.details?.periodDpp ?? 0) > 0 && (
                          <p className="mt-0.5 text-xs text-warning-500">
                            Dasar pengenaan (omzet bruto):{" "}
                            <NumberDisplay value={w.details!.periodDpp} prefix="Rp" />
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {regimeLabel && <p className="mt-1.5 text-xs text-warning-500">Skema pajak: {regimeLabel}</p>}
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Tutup pengingat"
            className="text-warning-400 hover:text-warning-500"
          >
            <XMarkIcon className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
