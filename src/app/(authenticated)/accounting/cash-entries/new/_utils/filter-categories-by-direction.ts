import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

/**
 * Pure `(categories, direction) → categories` — narrows the full category list to the ones
 * matching the entry direction being recorded, so switching the direction toggle re-derives
 * the picker options client-side instead of refetching per direction.
 *
 * Advisory pre-filter only, same standing as `eligibleAccountTypesFor`: the server owns the
 * real gate and rejects a mismatched pair with 422 `CASH_CATEGORY_DIRECTION_MISMATCH` on
 * `POST /accounting/cash-entries`. Never use this filter to decide whether a request may be
 * sent — only which options reach the picker.
 */
export function filterCategoriesByDirection(
  categories: CashCategoryEntity[],
  direction: CashEntryDirection,
): CashCategoryEntity[] {
  return categories.filter((category) => category.direction === direction);
}
