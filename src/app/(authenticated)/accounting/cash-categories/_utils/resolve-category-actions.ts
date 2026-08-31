export type CategoryRowActionKind = "edit" | "delete";

export type CategoryRowAction = {
  readonly kind: CategoryRowActionKind;
  readonly label: string;
  readonly variant: "default" | "danger";
};

export type CategoryRowActions =
  | { readonly hasMenu: false }
  | { readonly hasMenu: true; readonly options: readonly CategoryRowAction[] };

/**
 * Per-row action state from `isCurated` alone — the list resource carries no `is_referenced`, so
 * referenced-ness is not client-knowable and stays reactive (the 409 surfaces inside the dialog).
 *
 * A curated (BE-seeded) category gets NO action menu at all: the server rejects every write to it
 * with 409 `CASH_CATEGORY_CURATED`, and `ActionMenu` has no disabled state, so absence of the menu
 * is the disabled state. Note the deliberate tension this encodes: the server would permit
 * remapping an unreferenced curated category's account, but the product rule is "curated rows are
 * not editable from this screen", so the affordance is withheld rather than the request blocked.
 */
export function resolveCategoryActions(isCurated: boolean): CategoryRowActions {
  if (isCurated) return { hasMenu: false };

  return {
    hasMenu: true,
    options: [
      { kind: "edit", label: "Ubah", variant: "default" },
      { kind: "delete", label: "Hapus", variant: "danger" },
    ],
  };
}
