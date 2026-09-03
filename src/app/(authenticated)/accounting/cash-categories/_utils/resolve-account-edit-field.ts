import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { ServerError } from "@/core/resources/server-error";

/**
 * `LedgerAccountCombobox:37-44` already folds a non-null `value` back into its options when the
 * list hasn't caught up yet — that path is unreachable here only because `CashCategoryAccountEntity`
 * carries no `type`, so no `LedgerAccountEntity` can be fabricated from it. This resolver is the
 * substitute: it distinguishes "the CoA list hasn't loaded yet" (no notice — the field is simply not
 * ready) from "the list loaded and the saved account is genuinely absent from it" (a notice, since
 * that is a real, user-actionable problem) from "the list failed to load" (also a notice — the
 * account combobox otherwise renders enabled with zero options and no explanation, per CLAUDE.md's
 * "a component consuming a fetch hook must read `error`, not only `loading`").
 */
export type AccountEditFieldState =
  | { readonly kind: "loading" }
  | { readonly kind: "resolved"; readonly account: LedgerAccountEntity }
  | { readonly kind: "missing"; readonly savedId: string }
  | { readonly kind: "error"; readonly error: ServerError };

export type ResolvedAccountEditField = {
  readonly state: AccountEditFieldState;
  /** Submit already requires a non-null pick — this mirrors `state.kind === "resolved"` so the
   *  dialog's footer never re-derives the same predicate from the state union. */
  readonly canSubmit: boolean;
};

/**
 * Pure `(currentAccountId, accounts, error) → the field's display state`. `currentAccountId` is
 * whichever of "the user's own pick" or "the category's saved account id" the caller has already
 * resolved (mirrors `cash-category-edit-dialog.tsx`'s `accountId ?? editingCategory?.account.id ??
 * null`) — this module does not own that precedence, only what to show once an id is known.
 * `error` outranks `loading`/`missing`: a failed fetch is a real, user-actionable fault, and the
 * hook only ever returns a non-null `error` once `loading` is false and `accounts` is null.
 */
export function resolveAccountEditField(
  currentAccountId: string | null,
  accounts: ReadonlyArray<LedgerAccountEntity> | null,
  error?: ServerError | null,
): ResolvedAccountEditField {
  if (error) {
    return { state: { kind: "error", error }, canSubmit: false };
  }

  if (accounts === null || currentAccountId === null) {
    return { state: { kind: "loading" }, canSubmit: false };
  }

  const found = accounts.find((account) => account.id === currentAccountId) ?? null;
  if (found) return { state: { kind: "resolved", account: found }, canSubmit: true };

  return { state: { kind: "missing", savedId: currentAccountId }, canSubmit: false };
}
