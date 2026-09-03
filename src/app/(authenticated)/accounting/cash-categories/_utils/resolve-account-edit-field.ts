import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

/**
 * `LedgerAccountCombobox:37-44` already folds a non-null `value` back into its options when the
 * list hasn't caught up yet — that path is unreachable here only because `CashCategoryAccountEntity`
 * carries no `type`, so no `LedgerAccountEntity` can be fabricated from it. This resolver is the
 * substitute: it distinguishes "the CoA list hasn't loaded yet" (no notice — the field is simply not
 * ready) from "the list loaded and the saved account is genuinely absent from it" (a notice, since
 * that is a real, user-actionable problem).
 */
export type AccountEditFieldState =
  | { readonly kind: "loading" }
  | { readonly kind: "resolved"; readonly account: LedgerAccountEntity }
  | { readonly kind: "missing"; readonly savedId: string };

export type ResolvedAccountEditField = {
  readonly state: AccountEditFieldState;
  /** Submit already requires a non-null pick — this mirrors `state.kind === "resolved"` so the
   *  dialog's footer never re-derives the same predicate from the state union. */
  readonly canSubmit: boolean;
};

/**
 * Pure `(currentAccountId, accounts) → the field's display state`. `currentAccountId` is whichever
 * of "the user's own pick" or "the category's saved account id" the caller has already resolved
 * (mirrors `cash-category-edit-dialog.tsx`'s `accountId ?? editingCategory?.account.id ?? null`)
 * — this module does not own that precedence, only what to show once an id is known.
 */
export function resolveAccountEditField(
  currentAccountId: string | null,
  accounts: ReadonlyArray<LedgerAccountEntity> | null,
): ResolvedAccountEditField {
  if (accounts === null || currentAccountId === null) {
    return { state: { kind: "loading" }, canSubmit: false };
  }

  const found = accounts.find((account) => account.id === currentAccountId) ?? null;
  if (found) return { state: { kind: "resolved", account: found }, canSubmit: true };

  return { state: { kind: "missing", savedId: currentAccountId }, canSubmit: false };
}
