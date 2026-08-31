"use client";

import { useMemo } from "react";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { eligibleAccountTypesFor } from "@/features/accounting/domain/helpers/cash-category-eligibility";
import { CashEntrySettingsAccountField } from "@/app/(authenticated)/accounting/cash-entry-settings/_components/cash-entry-settings-account-field";
import { useCashEntrySettings } from "@/app/(authenticated)/accounting/cash-entry-settings/_providers/cash-entry-settings-provider";

// Advisory pre-filter only — the server still rejects an incompatible pair with 422
// CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH, which is what the inline strips below render.
const ELIGIBLE_INCOME_TYPES = eligibleAccountTypesFor(CashEntryDirection.In);
const ELIGIBLE_EXPENSE_TYPES = eligibleAccountTypesFor(CashEntryDirection.Out);

export function CashEntrySettingsForm() {
  const {
    incomeAccount,
    expenseAccount,
    incomeMissingSavedId,
    expenseMissingSavedId,
    formState,
    saveError,
    isSaving,
    selectIncome,
    selectExpense,
    save,
  } = useCashEntrySettings();

  const { incomeError, expenseError, formError, blockedReason, nothingToSave, canSave } = useMemo(
    () => ({
      incomeError: saveError?.placement === "income" ? saveError.message : null,
      expenseError: saveError?.placement === "expense" ? saveError.message : null,
      formError: saveError?.placement === "form" ? saveError.message : null,
      blockedReason: formState.status === "blocked" ? formState.reason : null,
      nothingToSave: formState.status === "no-changes",
      canSave: formState.status === "ready" && !isSaving,
    }),
    [formState, isSaving, saveError],
  );

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader title="Pengaturan Kas" backHref="/accounting/cash-entries" />

      <SectionCard title="Akun Default">
        <div className="flex flex-col gap-y-6">
          <p className="text-sm leading-5 text-neutral-400">
            Atur akun bawaan untuk pencatatan kas masuk dan kas keluar. Perubahan hanya berlaku untuk transaksi
            berikutnya — transaksi yang sudah tercatat tetap memakai akun lama.
          </p>

          <CashEntrySettingsAccountField
            label="Kas Masuk"
            placeholder="Pilih akun default kas masuk"
            account={incomeAccount}
            missingSavedId={incomeMissingSavedId}
            errorMessage={incomeError}
            filter={(account) => ELIGIBLE_INCOME_TYPES.includes(account.type)}
            onSelect={selectIncome}
          />

          <CashEntrySettingsAccountField
            label="Kas Keluar"
            placeholder="Pilih akun default kas keluar"
            account={expenseAccount}
            missingSavedId={expenseMissingSavedId}
            errorMessage={expenseError}
            filter={(account) => ELIGIBLE_EXPENSE_TYPES.includes(account.type)}
            onSelect={selectExpense}
          />

          {formError && (
            <p role="alert" className="text-sm text-red-500">
              {formError}
            </p>
          )}
          {blockedReason && (
            <p role="alert" className="text-sm text-red-500">
              {blockedReason}
            </p>
          )}
          {nothingToSave && <p className="text-sm text-neutral-400">Belum ada perubahan untuk disimpan.</p>}

          <PrimaryButton
            label="Simpan"
            loadingLabel="Menyimpan..."
            loading={isSaving}
            disabled={!canSave}
            onClick={save}
            className="w-full sm:w-auto sm:self-start"
          />
        </div>
      </SectionCard>
    </div>
  );
}
