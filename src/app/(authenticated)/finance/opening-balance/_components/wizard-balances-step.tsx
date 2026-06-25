"use client";

import { useMemo } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { NormalBalanceHintBlock } from "@/features/accounting/presentations/components/normal-balance-hint-block";
import { AccumulatedDeficitBlock } from "@/features/accounting/presentations/components/accumulated-deficit-block";
import { useOpeningBalanceWizard } from "@/app/(authenticated)/finance/opening-balance/_providers/opening-balance-wizard-provider";
import { BalanceCategoryAccordion } from "@/app/(authenticated)/finance/opening-balance/_components/balance-category-accordion";
import { WizardBalancesLoading } from "@/app/(authenticated)/finance/opening-balance/_components/wizard-balances-loading";
import { WizardBalancesError } from "@/app/(authenticated)/finance/opening-balance/_components/wizard-balances-error";

export function WizardBalancesStep() {
  const {
    groupedAccounts,
    amountMap,
    setAmount,
    hasAnyNonZeroInput,
    accountsLoading,
    accountsError,
    account3200Missing,
    normalBalanceError,
    isDeadEnd,
    handleDeadEnd,
    resolveAccount,
    goToStep,
  } = useOpeningBalanceWizard();

  const canProceed = useMemo(() => hasAnyNonZeroInput && !isDeadEnd, [hasAnyNonZeroInput, isDeadEnd]);

  if (accountsLoading) {
    return <WizardBalancesLoading />;
  }

  if (accountsError) {
    return <WizardBalancesError />;
  }

  if (account3200Missing) {
    return (
      <div className="flex flex-col gap-y-2">
        <p className="text-right text-xs text-neutral-300">Langkah 2 dari 3</p>
        <SectionCard title="">
          <div className="rounded-lg border border-error-100 bg-error-50 p-4">
            <p className="text-sm font-semibold text-error-500">Setup tidak dapat dilanjutkan</p>
            <p className="mt-1 text-sm text-neutral-500">
              Akun Saldo Laba Ditahan (kode 3200) tidak ditemukan pada daftar akun Anda. Hubungi tim
              Loonas untuk melanjutkan.
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-right text-xs text-neutral-300">Langkah 2 dari 3</p>
      <SectionCard title="">
        <div className="px-0">
          <h2 className="text-sm font-semibold text-neutral-400">Berapa kondisi usaha Anda sekarang?</h2>
          <p className="mt-1 text-sm text-neutral-300">
            Isi angka yang Anda tahu. Lewati akun yang tidak relevan — isi 0 atau kosongkan saja.
          </p>

          <div className="mt-4 flex flex-col gap-4">
            {/* Deficit dead-end replaces all accordions */}
            {normalBalanceError?.kind === "deficit" ? (
              <AccumulatedDeficitBlock onDeadEnd={handleDeadEnd} />
            ) : (
              <>
                <BalanceCategoryAccordion
                  groupLabel="Apa yang Anda miliki"
                  groupSubtitle="Aset usaha — uang, stok, piutang, dll."
                  accounts={groupedAccounts.assets}
                  amountMap={amountMap}
                  onAmountChange={setAmount}
                />
                <BalanceCategoryAccordion
                  groupLabel="Apa yang Anda utangi"
                  groupSubtitle="Liabilitas — utang usaha, pinjaman, dll."
                  accounts={groupedAccounts.liabilities}
                  amountMap={amountMap}
                  onAmountChange={setAmount}
                />
                <BalanceCategoryAccordion
                  groupLabel="Modal usaha Anda"
                  groupSubtitle="Ekuitas — modal yang ditanamkan dan saldo laba"
                  accounts={groupedAccounts.equity}
                  amountMap={amountMap}
                  onAmountChange={setAmount}
                />

                {/* Generic normal-balance hint (after a failed submit) */}
                {normalBalanceError?.kind === "generic" && (
                  <NormalBalanceHintBlock
                    lines={normalBalanceError.lines}
                    resolveAccount={resolveAccount}
                  />
                )}
              </>
            )}
          </div>

          {/* Sticky balance indicator */}
          <div className="sticky bottom-0 mt-4 border-t border-neutral-100 bg-white pt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="flex items-center gap-2 transition-colors duration-200 ease-out"
              >
                {hasAnyNonZeroInput ? (
                  <>
                    <CheckCircleIcon className="size-4 text-success-400" aria-hidden="true" />
                    <span className="text-sm font-medium text-success-400">Semua angka sudah pas</span>
                  </>
                ) : (
                  <>
                    <InformationCircleIcon className="size-4 text-neutral-300" aria-hidden="true" />
                    <span className="text-sm font-medium text-neutral-300">
                      Isi minimal satu angka untuk melanjutkan
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                <SecondaryButton
                  outlined
                  label="Kembali"
                  onClick={() => goToStep("date")}
                  className="w-full sm:w-auto sm:px-6"
                />
                <PrimaryButton
                  label="Tinjau Isian"
                  disabled={!canProceed}
                  onClick={() => goToStep("review")}
                  className="w-full sm:w-auto sm:px-8"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
