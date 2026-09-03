export type CategoryRowActionKind = "edit" | "delete" | "edit-account";

export type CategoryRowAction = {
  readonly kind: CategoryRowActionKind;
  readonly label: string;
  readonly variant: "default" | "danger";
};

export type CategoryRowActions =
  | { readonly hasMenu: false }
  | { readonly hasMenu: true; readonly options: readonly CategoryRowAction[] };

/**
 * Per-row action state from `{isCurated, isGeneral}`. LNS-788 replaced the deleted standalone
 * "Pengaturan Kas" settings page's account-remap capability with a row-level affordance on the two
 * "general" curated categories (misc income / misc expense) — the ONLY curated rows a
 * merchant can act on at all, and only to remap the account, never the name or direction: a single
 * `"edit-account"` option, no delete (deleting a general category would remove the one place a
 * merchant can redirect their misc income/expense, which the product does not offer).
 *
 * Every OTHER curated row still gets NO action menu — `isGeneral` already implies `isCurated` (see
 * `isGeneralCashCategory`), so it is checked first and never re-asserted inside its branch. An
 * ordinary curated category's only editable-looking field is its name, which the server rejects
 * outright with 409 `CASH_CATEGORY_CURATED`; `ActionMenu` has no disabled state, so withholding the
 * menu IS the disabled state, same reasoning as before LNS-788.
 *
 * The list resource still carries no `is_referenced`, so referenced-ness stays reactive — a general
 * row's account-remap can still 409 `CASH_CATEGORY_REFERENCED` inside the dialog.
 */
export function resolveCategoryActions(row: { isCurated: boolean; isGeneral: boolean }): CategoryRowActions {
  if (row.isGeneral) {
    return {
      hasMenu: true,
      options: [{ kind: "edit-account", label: "Ubah Akun", variant: "default" }],
    };
  }

  if (row.isCurated) return { hasMenu: false };

  return {
    hasMenu: true,
    options: [
      { kind: "edit", label: "Ubah", variant: "default" },
      { kind: "delete", label: "Hapus", variant: "danger" },
    ],
  };
}
