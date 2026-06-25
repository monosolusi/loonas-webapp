"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { useOpeningBalanceWizard } from "@/app/(authenticated)/finance/opening-balance/_providers/opening-balance-wizard-provider";
import { WizardConfirmDialog } from "@/app/(authenticated)/finance/opening-balance/_components/wizard-confirm-dialog";
import { ReviewGroupSummary } from "@/app/(authenticated)/finance/opening-balance/_components/review-group-summary";

export function WizardReviewStep() {
  const { asOf, groupedAccounts, amountMap, goToStep, openConfirmModal } = useOpeningBalanceWizard();

  const formattedDate = useMemo(() => {
    if (!asOf) return "";
    return DateTime.fromISO(asOf).setLocale("id").toFormat("d MMMM yyyy");
  }, [asOf]);

  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-right text-xs text-neutral-300">Langkah 3 dari 3</p>
      <SectionCard title="">
        <div className="px-0">
          <h2 className="text-sm font-semibold text-neutral-400">Tinjau isian Anda</h2>
          <p className="mt-1 text-sm text-neutral-300">
            Periksa kembali sebelum menyimpan. Setelah disimpan, data ini tidak dapat diubah.
          </p>

          {/* Info callout */}
          <div className="mt-4 flex gap-3 rounded-lg border border-primary-100 bg-primary-50 px-4 py-3">
            <InformationCircleIcon className="mt-0.5 size-5 shrink-0 text-primary-300" aria-hidden="true" />
            <p className="text-sm text-neutral-500">
              Pastikan angka di bawah sudah sesuai dengan kondisi usaha Anda pada{" "}
              <strong>{formattedDate}</strong>.
            </p>
          </div>

          {/* Date row */}
          <div className="mt-4 flex justify-between border-b border-neutral-100 pb-3">
            <span className="text-sm text-neutral-300">Tanggal mulai</span>
            <span className="text-sm font-medium text-neutral-400">{formattedDate}</span>
          </div>

          {/* Summary groups */}
          <div className="mt-4 flex flex-col gap-4">
            <ReviewGroupSummary
              groupLabel="Apa yang Anda miliki"
              accounts={groupedAccounts.assets}
              amountMap={amountMap}
            />
            <div className="border-t border-neutral-100" />
            <ReviewGroupSummary
              groupLabel="Apa yang Anda utangi"
              accounts={groupedAccounts.liabilities}
              amountMap={amountMap}
            />
            <div className="border-t border-neutral-100" />
            <ReviewGroupSummary
              groupLabel="Modal usaha Anda"
              accounts={groupedAccounts.equity}
              amountMap={amountMap}
            />
          </div>

          {/* Balance confirmation chip */}
          <div className="mt-4">
            <StatusChip variant="success" label="Seimbang" />
          </div>

          {/* Collapsible accounting detail (optional) */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-primary-300">
              Lihat detail akuntansi ▸
            </summary>
            <div className="mt-2 rounded-lg bg-neutral-50 p-4">
              <p className="text-xs text-neutral-300">
                Catatan teknis: saldo awal diposting sebagai jurnal entri berganda (double-entry). Akun
                aset dicatat di sisi debit; liabilitas dan ekuitas di sisi kredit. Selisih otomatis
                disesuaikan ke akun Saldo Laba Ditahan (3200).
              </p>
            </div>
          </details>

          {/* Actions */}
          <div className="mt-6 flex justify-between border-t border-neutral-100 pt-6">
            <SecondaryButton
              outlined
              label="Kembali"
              onClick={() => goToStep("balances")}
              className="w-auto px-6"
            />
            <PrimaryButton
              label="Simpan Saldo Awal"
              onClick={openConfirmModal}
              className="w-auto px-8"
            />
          </div>
        </div>
      </SectionCard>

      <WizardConfirmDialog />
    </div>
  );
}
