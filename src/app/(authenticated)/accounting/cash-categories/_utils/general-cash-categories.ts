/**
 * FE-owned allowlist identifying the two "general" curated cash categories — the merchant-facing
 * misc-income / misc-expense buckets whose account can be remapped from `/accounting/cash-categories`
 * (the "Ubah Akun" row action, LNS-788). The live spec carries no discriminator field for this —
 * `grep -c "is_general"` over `dev-api.loonas.id/openapi.json` returns 0 — so this is a name-based
 * allowlist, framed the same way `MINIMUM_ACCOUNT_HOLDER_AGE_YEARS` is: an FE-owned floor, not a
 * mirrored BE contract.
 *
 * It FAILS CLOSED: a BE rename of either category silently drops the "Ubah Akun" affordance rather
 * than erroring or misidentifying an unrelated row. Delete this module (and route
 * `resolveCategoryActions` off the real field instead) once LNS-787 ships an `is_general` field.
 */
const GENERAL_CASH_CATEGORY_NAMES: readonly string[] = ["Pendapatan Lain-lain", "Beban Lain-lain"];

export type GeneralCashCategoryCandidate = {
  readonly isCurated: boolean;
  readonly name: string;
};

/**
 * A category is "general" only if it is BOTH curated AND its name is on the allowlist — a
 * merchant-created category that happens to share a name with a general category is not general
 * (curated is BE-owned and cannot be spoofed by a merchant), and a curated category whose name
 * later drifts from the allowlist loses the affordance rather than misfiring on the wrong row.
 */
export function isGeneralCashCategory(category: GeneralCashCategoryCandidate): boolean {
  return category.isCurated && GENERAL_CASH_CATEGORY_NAMES.includes(category.name);
}
