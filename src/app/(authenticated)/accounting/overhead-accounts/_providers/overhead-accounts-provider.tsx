"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { ServerError } from "@/core/resources/server-error";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { useListOverheadAccounts } from "@/features/accounting/presentations/hooks/use-list-overhead-accounts";
import { useReplaceOverheadAccounts } from "@/features/accounting/presentations/hooks/use-replace-overhead-accounts";
import {
  addAccountToBuffer,
  isBufferDirty,
  isClearingAllAccounts,
  removeAccountFromBuffer,
} from "@/app/(authenticated)/accounting/overhead-accounts/_utils/overhead-selection-buffer";
import {
  OverheadRejectionInfo,
  resolveOverheadRejection,
} from "@/app/(authenticated)/accounting/overhead-accounts/_utils/resolve-overhead-rejection";

type OverheadAccountsContextValue = {
  /** Last-saved-from-server selection — the dirty-diff baseline. */
  savedAccounts: LedgerAccountEntity[];
  /** Local editable buffer. Guaranteed non-null once children render (provider-guarantee). */
  bufferAccounts: LedgerAccountEntity[];
  /** Fetch error for the initial GET — drives the in-card error state. */
  error: ServerError | null;
  onRetry: () => void;
  isDirty: boolean;
  isSaving: boolean;
  addAccount: (account: LedgerAccountEntity) => void;
  removeAccount: (accountId: string) => void;
  rejection: OverheadRejectionInfo | null;
  dismissRejection: () => void;
  handleSave: () => void;
  confirmClearOpen: boolean;
  closeConfirmClear: () => void;
  confirmClearAndSave: () => Promise<void>;
};

const OverheadAccountsContext = createContext<OverheadAccountsContextValue | null>(null);

export function useOverheadAccounts() {
  const context = useContext(OverheadAccountsContext);
  if (!context) throw new Error("useOverheadAccounts must be used within OverheadAccountsProvider");
  return context;
}

type OverheadAccountsProviderProps = {
  loading: React.ReactNode;
  children: React.ReactNode;
};

export function OverheadAccountsProvider({ loading: loadingIndicator, children }: OverheadAccountsProviderProps) {
  const listResult = useListOverheadAccounts();
  const { trigger, isMutating } = useReplaceOverheadAccounts();
  const { showToast } = useToast();

  // Local override buffer: null means "not yet edited — mirror savedAccounts". Mirrors the
  // formValuesOverride pattern in tax-posture-provider.tsx.
  const [bufferOverride, setBufferOverride] = useState<LedgerAccountEntity[] | null>(null);
  const [rejection, setRejection] = useState<OverheadRejectionInfo | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const savedAccounts = useMemo<LedgerAccountEntity[]>(() => {
    if (!listResult.selections) return [];
    return listResult.selections.map((s) => s.coaAccount);
  }, [listResult.selections]);

  const bufferAccounts = bufferOverride ?? savedAccounts;

  const isDirty = useMemo(() => isBufferDirty(bufferAccounts, savedAccounts), [bufferAccounts, savedAccounts]);

  const addAccount = useCallback(
    (account: LedgerAccountEntity) => {
      setBufferOverride((prev) => addAccountToBuffer(prev ?? savedAccounts, account));
    },
    [savedAccounts],
  );

  const removeAccount = useCallback(
    (accountId: string) => {
      setBufferOverride((prev) => removeAccountFromBuffer(prev ?? savedAccounts, accountId));
    },
    [savedAccounts],
  );

  const performSave = useCallback(
    async (accounts: LedgerAccountEntity[]) => {
      setRejection(null);
      try {
        await trigger({ accountIds: accounts.map((a) => a.id) });
        await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_OVERHEAD_ACCOUNTS);
        setBufferOverride(null); // re-derive buffer from the freshly revalidated savedAccounts
        showToast("Akun overhead berhasil disimpan.", "success");
      } catch (err) {
        // Never throw from an async handler — the rejection banner is the surface for this,
        // deliberately not doubled up with a toast.
        setRejection(resolveOverheadRejection(err));
      }
    },
    [trigger, showToast],
  );

  const handleSave = useCallback(() => {
    if (!isDirty || isMutating) return;
    if (isClearingAllAccounts(bufferAccounts, savedAccounts)) {
      setConfirmClearOpen(true);
      return;
    }
    void performSave(bufferAccounts);
  }, [isDirty, isMutating, bufferAccounts, savedAccounts, performSave]);

  const confirmClearAndSave = useCallback(async () => {
    setConfirmClearOpen(false);
    await performSave(bufferAccounts);
  }, [performSave, bufferAccounts]);

  const closeConfirmClear = useCallback(() => {
    if (isMutating) return;
    setConfirmClearOpen(false);
  }, [isMutating]);

  const dismissRejection = useCallback(() => setRejection(null), []);

  const onRetry = useCallback(() => {
    // Swallowed deliberately: SWR leaves `error` populated on a failed revalidation, so the
    // in-card error state and its retry button simply stay on screen.
    void revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_OVERHEAD_ACCOUNTS).catch(() => {});
  }, []);

  if (listResult.loading) return <>{loadingIndicator}</>;

  return (
    <OverheadAccountsContext.Provider
      value={{
        savedAccounts,
        bufferAccounts,
        error: listResult.error,
        onRetry,
        isDirty,
        isSaving: isMutating,
        addAccount,
        removeAccount,
        rejection,
        dismissRejection,
        handleSave,
        confirmClearOpen,
        closeConfirmClear,
        confirmClearAndSave,
      }}
    >
      {children}
    </OverheadAccountsContext.Provider>
  );
}
