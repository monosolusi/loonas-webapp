import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";

/**
 * Client-side search over the loaded list. The list endpoint takes `direction` only — no
 * `search` param — so the toolbar search must never be wired to a server param. Matches the
 * category name and its account code/name case-insensitively; an empty or whitespace-only query
 * returns the list unchanged (as a new array, so consumers can depend on identity).
 */
export function filterCashCategories(
  categories: readonly CashCategoryEntity[],
  rawQuery: string,
): CashCategoryEntity[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [...categories];

  return categories.filter(
    (category) =>
      category.name.toLowerCase().includes(query) ||
      category.account.code.toLowerCase().includes(query) ||
      category.account.name.toLowerCase().includes(query),
  );
}
