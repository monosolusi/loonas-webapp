"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { IncomeStatementMigrationNotice } from "@/features/accounting/presentations/components/reports/income-statement-migration-notice";
import { useOpeningBalanceWizard } from "@/app/(authenticated)/finance/opening-balance/_providers/opening-balance-wizard-provider";

const today = DateTime.now().toISODate() ?? "";
const SANITY_FLOOR = "2020-01-01";

export function WizardDateStep() {
  const { asOf, setAsOf, goToStep } = useOpeningBalanceWizard();

  const isFutureDate = useMemo(() => !!asOf && asOf > today, [asOf]);
  const isPreFloorDate = useMemo(() => !!asOf && asOf < SANITY_FLOOR, [asOf]);

  const canProceed = useMemo(() => !!asOf && !isFutureDate, [asOf, isFutureDate]);

  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-right text-xs text-neutral-300">Langkah 1 dari 3</p>
      <SectionCard title="">
        <div className="px-0">
          <h2 className="text-sm font-semibold text-neutral-400">Tanggal mulai pencatatan</h2>
          <p className="mt-1 text-sm text-neutral-300">
            Pilih tanggal di mana saldo usaha Anda akan mulai dicatat di Loonas. Biasanya ini adalah
            awal bulan atau awal tahun buku.
          </p>

          <div className="mt-4">
            <label
              htmlFor="as_of_date"
              className="block text-sm font-medium text-neutral-400"
            >
              Tanggal mulai <span className="text-error-400">*</span>
            </label>
            <input
              id="as_of_date"
              type="date"
              required
              max={today}
              value={asOf}
              onChange={(e) => setAsOf(e.target.value)}
              aria-invalid={isFutureDate ? "true" : undefined}
              aria-describedby={isFutureDate ? "as_of_date_error" : isPreFloorDate ? "as_of_date_warning" : undefined}
              className={clsx(
                "mt-1 h-11 w-full rounded-lg border px-3 text-sm text-neutral-400 outline-none transition-all focus:ring-2",
                isFutureDate
                  ? "border-error-400 focus:border-error-400 focus:ring-error-400/20"
                  : "border-neutral-100 focus:border-primary-300 focus:ring-primary-300/20",
              )}
            />
            {isFutureDate && (
              <p id="as_of_date_error" className="mt-1 text-xs text-error-400">
                Tanggal tidak boleh melewati hari ini.
              </p>
            )}
            {!isFutureDate && isPreFloorDate && (
              <p id="as_of_date_warning" className="mt-1 text-xs text-warning-400">
                Pastikan tanggal ini sesuai dengan catatan usaha Anda.
              </p>
            )}
          </div>

          <div className="mt-4">
            <IncomeStatementMigrationNotice />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-neutral-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <SecondaryButton
              outlined
              label="Kembali"
              onClick={() => goToStep("intro")}
              className="w-full sm:w-auto sm:px-6"
            />
            <PrimaryButton
              label="Lanjut"
              disabled={!canProceed}
              onClick={() => goToStep("balances")}
              className="w-full sm:w-auto sm:px-8"
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
