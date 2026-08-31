"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ServerError } from "@/core/resources/server-error";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { useGetCashEntrySettings } from "@/features/accounting/presentations/hooks/use-get-cash-entry-settings";
import { useListAllLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-all-ledger-accounts";
import { useUpdateCashEntrySettings } from "@/features/accounting/presentations/hooks/use-update-cash-entry-settings";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { classifySaveError } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/classify-save-error";
import { PlacedSaveError } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-feedback";
import { classifyFetchError } from "@/core/helpers/classify-fetch-error";
import {
  CashEntrySettingsFormState,
  CashEntrySettingsSelection,
  resolveSavedSelection,
  resolveSettingsFormState,
  SavedCashEntrySettings,
} from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-form-state";
import { CashEntrySettingsError } from "@/app/(authenticated)/accounting/cash-entry-settings/_components/cash-entry-settings-error";

type CashEntrySettingsContextValue = {
  /** The resolved selection per picker — the tagged union the field renders from. */
  income: CashEntrySettingsSelection;
  expense: CashEntrySettingsSelection;
  accounts: ReadonlyArray<LedgerAccountEntity> | null;
  formState: CashEntrySettingsFormState;
  saveError: PlacedSaveError | null;
  isSaving: boolean;
  selectIncome: (account: LedgerAccountEntity | null) => void;
  selectExpense: (account: LedgerAccountEntity | null) => void;
  save: () => Promise<void>;
};

const CashEntrySettingsContext = createContext<CashEntrySettingsContextValue | null>(null);

export function useCashEntrySettings() {
  const context = useContext(CashEntrySettingsContext);
  if (!context) throw new Error("useCashEntrySettings must be used within CashEntrySettingsProvider");
  return context;
}

type CashEntrySettingsProviderProps = {
  loading: React.ReactNode;
  children: React.ReactNode;
};

export function CashEntrySettingsProvider({ loading, children }: CashEntrySettingsProviderProps) {
  const { showToast } = useToast();
  const settingsState = useGetCashEntrySettings();
  const accountsState = useListAllLedgerAccounts();
  const { trigger, isMutating } = useUpdateCashEntrySettings();

  // `null` = the user has not touched the picker, so its selection stays DERIVED from the saved
  // record. Seeding state from the fetch instead would let a background refetch clobber (or
  // resurrect) an edit the user already made.
  const [incomeOverride, setIncomeOverride] = useState<CashEntrySettingsSelection | null>(null);
  const [expenseOverride, setExpenseOverride] = useState<CashEntrySettingsSelection | null>(null);
  const [saveError, setSaveError] = useState<PlacedSaveError | null>(null);

  const isSaving = isMutating;

  const saved = useMemo<SavedCashEntrySettings>(
    () => ({
      defaultIncomeAccountId: settingsState.data?.defaultIncomeAccountId ?? null,
      defaultExpenseAccountId: settingsState.data?.defaultExpenseAccountId ?? null,
    }),
    [settingsState.data],
  );

  const accounts = accountsState.accounts;

  const income = useMemo(
    () => incomeOverride ?? resolveSavedSelection(saved.defaultIncomeAccountId, accounts),
    [incomeOverride, saved, accounts],
  );
  const expense = useMemo(
    () => expenseOverride ?? resolveSavedSelection(saved.defaultExpenseAccountId, accounts),
    [expenseOverride, saved, accounts],
  );

  const formState = useMemo(() => resolveSettingsFormState(saved, income, expense), [saved, income, expense]);

  const selectIncome = useCallback((account: LedgerAccountEntity | null) => {
    setIncomeOverride(account ? { kind: "account", accountId: account.id } : { kind: "empty" });
    setSaveError(null);
  }, []);

  const selectExpense = useCallback((account: LedgerAccountEntity | null) => {
    setExpenseOverride(account ? { kind: "account", accountId: account.id } : { kind: "empty" });
    setSaveError(null);
  }, []);

  const save = useCallback(async () => {
    if (isSaving) return;
    if (formState.status !== "ready") return;
    setSaveError(null);

    try {
      await trigger(formState.body);
      // The hook's fetcher already revalidates the settings key fire-and-forget — do not repeat it here.
      showToast("Pengaturan kas berhasil disimpan.", "success");
    } catch (err) {
      if (!(err instanceof ServerError)) {
        showToast("Gagal menyimpan pengaturan kas. Silakan coba lagi.", "error");
        return;
      }

      const classified = classifySaveError(err, formState.body);
      if (classified.placement === "toast") showToast(classified.message, "error");
      else setSaveError({ placement: classified.placement, message: classified.message });
    }
  }, [formState, isSaving, showToast, trigger]);

  const retry = useCallback(() => {
    // A bound mutate refetches and rethrows when the refetch fails, so both retries are
    // swallowed — SWR leaves `error` set either way and this page keeps its retry affordance.
    void settingsState.refresh?.().catch(() => {});
    void revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_ALL_LEDGER_ACCOUNTS).catch(() => {});
  }, [settingsState.refresh]);

  if (settingsState.loading || accountsState.loading) return <>{loading}</>;

  // The settings GET is the page's primary record, so its failure decides the affordance: a
  // terminal 403 gets no retry it can only fail, leaving the "Kembali ke Kas" link as the escape.
  const fetchError = settingsState.error ?? accountsState.error;
  if (fetchError) {
    const { retryable } = classifyFetchError(fetchError);
    return <CashEntrySettingsError onRetry={retryable ? retry : undefined} />;
  }

  return (
    <CashEntrySettingsContext.Provider
      value={{
        income,
        expense,
        accounts,
        formState,
        saveError,
        isSaving,
        selectIncome,
        selectExpense,
        save,
      }}
    >
      {children}
    </CashEntrySettingsContext.Provider>
  );
}
