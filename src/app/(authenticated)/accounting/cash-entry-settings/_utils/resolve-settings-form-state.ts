import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

/** The saved defaults as the GET returns them — both ids nullable, `null` = "no default configured". */
export type SavedCashEntrySettings = {
  defaultIncomeAccountId: string | null;
  defaultExpenseAccountId: string | null;
};

/**
 * One picker's current selection. The distinction the type exists for: `empty` covers both
 * "no default was ever saved" and "the user cleared it", while `missing` is the state where a
 * saved id is absent from the ledger-account list — rendering that as an empty combobox would
 * read as "no default configured" and hide the problem, so it is its own state with its own copy.
 */
export type CashEntrySettingsSelection =
  | { kind: "empty" }
  | { kind: "account"; accountId: string }
  | { kind: "missing"; savedId: string };

/** Partial PATCH payload for `useUpdateCashEntrySettings`. An absent key leaves the saved default unchanged; an explicit `null` clears it. */
export type CashEntrySettingsPatchBody = {
  defaultIncomeAccountId?: string | null;
  defaultExpenseAccountId?: string | null;
};

export type CashEntrySettingsFormState =
  | { status: "no-changes" }
  | { status: "ready"; body: CashEntrySettingsPatchBody }
  | { status: "blocked"; reason: string };

/**
 * Maps a saved default id onto a selection against the loaded account list. An id the list does
 * not carry is `missing`, never `empty` — that is the difference between "no default configured"
 * and "the saved default cannot be shown". A list that has not loaded yet also resolves to
 * `empty`; the provider renders its skeleton until the list is ready, so that branch is never
 * displayed.
 */
export function resolveSavedSelection(
  savedAccountId: string | null,
  accounts: ReadonlyArray<LedgerAccountEntity> | null,
): CashEntrySettingsSelection {
  if (!savedAccountId || !accounts) return { kind: "empty" };
  return accounts.some((account) => account.id === savedAccountId)
    ? { kind: "account", accountId: savedAccountId }
    : { kind: "missing", savedId: savedAccountId };
}

/** The entity a selection displays in the combobox — `null` for `empty` and `missing` alike. */
export function resolveSelectedAccount(
  selection: CashEntrySettingsSelection,
  accounts: ReadonlyArray<LedgerAccountEntity> | null,
): LedgerAccountEntity | null {
  if (selection.kind !== "account") return null;
  return accounts?.find((account) => account.id === selection.accountId) ?? null;
}

function resolveFieldChange(
  selection: CashEntrySettingsSelection,
  savedAccountId: string | null,
): { changed: boolean; value: string | null } {
  switch (selection.kind) {
    case "empty":
      // Clearing only counts as a change when a default was actually saved — an explicit
      // `null` over an already-null default would be a pointless request.
      return { changed: savedAccountId !== null, value: null };
    case "account":
      return { changed: selection.accountId !== savedAccountId, value: selection.accountId };
    case "missing":
      // Unreachable — a `missing` field blocks before any body is built.
      return { changed: false, value: savedAccountId };
  }
}

/**
 * Pure `(saved, selectedIncome, selectedExpense) → form state`, and the SOLE owner of what the
 * save button does:
 *
 * - a saved id that is `missing` blocks the save outright — the user is about to write a default
 *   they cannot see, so the button stays off until they re-pick or clear that field;
 * - otherwise the body carries ONLY the keys that changed: an unchanged key is omitted (the
 *   server leaves it alone) and a cleared key is an explicit `null` (the only way a clear
 *   survives `JSON.stringify` — an `undefined` key is silently dropped, LNS-573);
 * - nothing changed short-circuits to `no-changes`, so no request is sent at all.
 */
export function resolveSettingsFormState(
  saved: SavedCashEntrySettings,
  selectedIncome: CashEntrySettingsSelection,
  selectedExpense: CashEntrySettingsSelection,
): CashEntrySettingsFormState {
  if (selectedIncome.kind === "missing" || selectedExpense.kind === "missing") {
    return {
      status: "blocked",
      reason:
        "Akun default yang tersimpan tidak ditemukan. Pilih ulang akunnya atau kosongkan kolomnya untuk menyimpan.",
    };
  }

  const body: CashEntrySettingsPatchBody = {};
  const income = resolveFieldChange(selectedIncome, saved.defaultIncomeAccountId);
  if (income.changed) body.defaultIncomeAccountId = income.value;
  const expense = resolveFieldChange(selectedExpense, saved.defaultExpenseAccountId);
  if (expense.changed) body.defaultExpenseAccountId = expense.value;

  if (!income.changed && !expense.changed) return { status: "no-changes" };
  return { status: "ready", body };
}
