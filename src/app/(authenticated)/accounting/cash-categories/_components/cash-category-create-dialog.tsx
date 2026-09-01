"use client";

import { useEffect, useMemo, useState } from "react";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { eligibleAccountTypesFor } from "@/features/accounting/domain/helpers/cash-category-eligibility";
import { useListAllLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-all-ledger-accounts";
import { useCashCategoriesProvider } from "@/app/(authenticated)/accounting/cash-categories/_providers/cash-categories-provider";
import { resolveCreateDirection } from "@/app/(authenticated)/accounting/cash-categories/_utils/resolve-create-direction";
import { CashCategoryCreateFormDialog } from "@/app/(authenticated)/accounting/cash-entries/new/_components/cash-category-create-form-dialog";

// Same copy as the entry-flow create dialog verbatim — recovery is SWR's own auto-retry
// (errorRetryInterval backoff) plus revalidateOnFocus, not a manual action this dialog can offer.
const ACCOUNTS_FETCH_ERROR =
  "Gagal memuat daftar akun. Daftar akan dimuat ulang otomatis beberapa saat lagi, atau saat halaman ini kembali aktif.";
const CHOOSE_DIRECTION_ERROR = "Pilih arah kas terlebih dahulu.";
const ACCOUNT_DISCARDED_NOTICE = "Akun yang dipilih sebelumnya direset karena tidak sesuai dengan arah kas baru.";

export function CashCategoryCreateDialog() {
  const {
    direction: activeTab,
    createOpen,
    closeCreate,
    isCreating,
    createError,
    submitCreate,
  } = useCashCategoriesProvider();
  const { accounts, loading: accountsLoading, error: accountsError } = useListAllLedgerAccounts();

  const resolution = useMemo(() => resolveCreateDirection(activeTab), [activeTab]);

  const [name, setName] = useState("");
  const [account, setAccount] = useState<LedgerAccountEntity | null>(null);
  // Only used in choose mode ("Semua" tab) — the direction the user has picked in the dialog,
  // independent of the page's active tab so picking a direction here never touches the URL.
  const [chosenDirection, setChosenDirection] = useState<CashEntryDirection | null>(null);
  // A LATCH, not a derived value — must NOT be guarded on `account === null` (that would
  // resurrect the notice any time the picker is simply empty). Set true only when a direction
  // switch actually discards a previously chosen account; dismissed explicitly on that field's
  // own edit path (picking an account, or switching direction again).
  const [accountWasDiscarded, setAccountWasDiscarded] = useState(false);

  // Fresh buffer on every open — a cancelled dialog must not leave its half-typed category behind.
  useEffect(() => {
    if (createOpen) {
      setName("");
      setAccount(null);
      setChosenDirection(null);
      setAccountWasDiscarded(false);
    }
  }, [createOpen]);

  const resolvedDirection = resolution.mode === "fixed" ? resolution.direction : chosenDirection;

  // ADVISORY pre-filter only — the server owns the real gate (422
  // CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH), so this narrows the picker, it never validates the submit.
  const eligibleAccounts = useMemo(() => {
    if (!resolvedDirection) return [];
    const eligibleTypes = new Set(eligibleAccountTypesFor(resolvedDirection));
    return (accounts ?? []).filter((a) => eligibleTypes.has(a.type));
  }, [accounts, resolvedDirection]);

  const handleDirectionChange = (next: CashEntryDirection) => {
    setChosenDirection(next);
    // Dependent-field reset keyed on the pick becoming invalid, not on "a direction was
    // clicked" — a not-yet-eligible account only needs clearing on a genuine switch. Computed
    // from the closure's `account` (not a functional updater) so the discard notice can be set
    // alongside it without a setState-inside-setState side effect.
    const eligibleTypes = new Set(eligibleAccountTypesFor(next));
    const willDiscard = account !== null && !eligibleTypes.has(account.type);
    if (willDiscard) setAccount(null);
    // Dismiss-on-own-edit-path: a further direction switch always clears the previous notice
    // before possibly raising a new one for THIS switch.
    setAccountWasDiscarded(willDiscard);
  };

  const handleAccountChange = (value: LedgerAccountEntity | null) => {
    setAccount(value);
    // Picking an account is itself the dismiss action for the discard notice.
    setAccountWasDiscarded(false);
  };

  const handleSubmit = () => {
    // Re-entry guard — a disabled button does not block Enter-key submission from a text input.
    if (isCreating) return;
    // Defensive only: with no direction chosen, the picker stays disabled so `account` can never
    // be set, and the submit button is already disabled via `!name.trim() || !account`. There is
    // no <form>, so Enter cannot reach this either.
    if (!resolvedDirection || !name.trim() || !account) return;
    submitCreate({ name: name.trim(), accountId: account.id, direction: resolvedDirection });
  };

  // "No direction picked yet" ranks FIRST — it is the more fundamental reason the picker is
  // unusable: even a successful accounts reload leaves it disabled until a direction is chosen.
  // SWR keeps `error` populated across revalidation, so ranking the fetch error first would leave
  // an unfixable-by-reload message on screen once a direction is finally picked.
  const accountsErrorMessage =
    resolvedDirection === null ? CHOOSE_DIRECTION_ERROR : accountsError ? ACCOUNTS_FETCH_ERROR : null;
  const accountsErrorTone = resolvedDirection === null ? "notice" : "error";

  return (
    <CashCategoryCreateFormDialog
      open={createOpen}
      direction={resolvedDirection}
      onDirectionChange={resolution.mode === "choose" ? handleDirectionChange : undefined}
      name={name}
      account={account}
      accounts={eligibleAccounts}
      accountsLoading={accountsLoading}
      accountsError={accountsErrorMessage}
      accountsErrorTone={accountsErrorTone}
      accountDiscardedNotice={accountWasDiscarded ? ACCOUNT_DISCARDED_NOTICE : null}
      formError={createError}
      loading={isCreating}
      onNameChange={setName}
      onAccountChange={handleAccountChange}
      onSubmit={handleSubmit}
      onClose={closeCreate}
    />
  );
}
