"use client";

import { useMemo } from "react";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { eligibleAccountTypesFor } from "@/features/accounting/domain/helpers/cash-category-eligibility";
import { CashEntrySettingsAccountField } from "@/app/(authenticated)/accounting/cash-entry-settings/_components/cash-entry-settings-account-field";
import { CashEntrySettingsFeedback } from "@/app/(authenticated)/accounting/cash-entry-settings/_components/cash-entry-settings-feedback";
import { useCashEntrySettings } from "@/app/(authenticated)/accounting/cash-entry-settings/_providers/cash-entry-settings-provider";
import {
  resolveFieldSaveError,
  resolveSettingsFeedback,
} from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-feedback";
import { resolveSaveButtonState } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-save-button-state";
import {
  CASH_ENTRY_SETTINGS_COPY,
  resolveEligibleAccountTypesHint,
} from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/cash-entry-settings-copy";

// Advisory pre-filter only — the server still rejects an incompatible pair with 422
// CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH, which is what the inline strips below render.
const ELIGIBLE_INCOME_TYPES = eligibleAccountTypesFor(CashEntryDirection.In);
const ELIGIBLE_EXPENSE_TYPES = eligibleAccountTypesFor(CashEntryDirection.Out);

/** Composition only — every display decision is resolved in a pure `_utils/` module. */
export function CashEntrySettingsForm() {
  const {
    income,
    expense,
    accounts,
    formState,
    saveError,
    isSaving,
    selectIncome,
    selectExpense,
    save,
  } = useCashEntrySettings();

  const feedback = useMemo(() => resolveSettingsFeedback(formState, saveError), [formState, saveError]);
  const incomeError = useMemo(() => resolveFieldSaveError(saveError, "income"), [saveError]);
  const expenseError = useMemo(() => resolveFieldSaveError(saveError, "expense"), [saveError]);
  const saveButton = useMemo(() => resolveSaveButtonState({ formState, isSaving }), [formState, isSaving]);

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader title="Pengaturan Kas" backHref="/accounting/cash-entries" />

      <SectionCard title={CASH_ENTRY_SETTINGS_COPY.defaultAccountCard.title}>
        <div className="flex flex-col gap-y-6">
          <p className="text-sm leading-5 text-neutral-400">
            {CASH_ENTRY_SETTINGS_COPY.defaultAccountCard.description}
          </p>

          <CashEntrySettingsAccountField
            label="Kas Masuk"
            placeholder="Pilih akun default kas masuk"
            selection={income}
            accounts={accounts}
            errorMessage={incomeError}
            filter={(account) => ELIGIBLE_INCOME_TYPES.includes(account.type)}
            onSelect={selectIncome}
            hint={resolveEligibleAccountTypesHint(CashEntryDirection.In)}
          />

          <CashEntrySettingsAccountField
            label="Kas Keluar"
            placeholder="Pilih akun default kas keluar"
            selection={expense}
            accounts={accounts}
            errorMessage={expenseError}
            filter={(account) => ELIGIBLE_EXPENSE_TYPES.includes(account.type)}
            onSelect={selectExpense}
            hint={resolveEligibleAccountTypesHint(CashEntryDirection.Out)}
          />

          <CashEntrySettingsFeedback feedback={feedback} />

          <PrimaryButton {...saveButton} onClick={save} className="w-full sm:w-auto sm:self-start" />
        </div>
      </SectionCard>
    </div>
  );
}
