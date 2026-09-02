import { SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";

export type CashCategoryOption = SearchComboboxOption & { entity: CashCategoryEntity };

/**
 * Pure `(categories, selected) → options` for the `SearchCombobox` category picker.
 *
 * `label` is the category NAME ONLY — never the account code — because `SearchCombobox` always
 * renders `label`, and the account code is a lookup aid, not part of the category's identity.
 * `keywords` carries `"{code} — {name}"` of the linked `CashCategoryAccountEntity` so an
 * accountant can search by account code; `SearchCombobox` matches `keywords` during filtering
 * but never displays it.
 *
 * `onCategoryCreated` in the create provider does an OPTIMISTIC `setCategory(created)` with no
 * `revalidateSWRKey`, so a freshly created category can be selected before it exists in the
 * fetched list. A picker must never hold a value its options cannot render, so `selected` is
 * appended to the option list whenever it is not already present — never duplicated when it is.
 */
export function buildCashCategoryOptions(
  categories: CashCategoryEntity[],
  selected: CashCategoryEntity | null,
): CashCategoryOption[] {
  const options = categories.map((category) => toOption(category));

  if (selected && !categories.some((category) => category.id === selected.id)) {
    options.push(toOption(selected));
  }

  return options;
}

function toOption(category: CashCategoryEntity): CashCategoryOption {
  return {
    id: category.id,
    label: category.name,
    keywords: `${category.account.code} — ${category.account.name}`,
    entity: category,
  };
}
