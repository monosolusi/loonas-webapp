"use client";

import { useMemo } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { SelectInput, SelectOption } from "@/core/presentations/components/select-input";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useListCashCategories } from "@/features/accounting/presentations/hooks/use-list-cash-category";
import { useCashEntryCreate } from "@/app/(authenticated)/accounting/cash-entries/new/_providers/cash-entry-create-provider";
import { filterCategoriesByDirection } from "@/app/(authenticated)/accounting/cash-entries/new/_utils/filter-categories-by-direction";
import { CategoriesFetchError } from "@/app/(authenticated)/accounting/cash-entries/new/_components/categories-fetch-error";
import { CashCategoryCreateDialog } from "@/app/(authenticated)/accounting/cash-entries/new/_components/cash-category-create-dialog";

const EMPTY_FOR_DIRECTION_DESCRIPTION = "Belum ada kategori untuk arah ini. Tambahkan kategori baru.";

export function CashEntryCategoryPicker() {
  const { direction, category, fieldErrors, selectCategory, openCreateCategoryDialog } = useCashEntryCreate();
  const categoriesState = useListCashCategories();

  // The just-created category is auto-selected before the fire-and-forget list refetch lands,
  // so the current selection is folded back into its own option list — a select must never
  // hold a value its options cannot render.
  const selectableCategories = useMemo(() => {
    const filtered = filterCategoriesByDirection(categoriesState.categories ?? [], direction);
    if (category && category.direction === direction && !filtered.some((c) => c.id === category.id)) {
      return [...filtered, category];
    }
    return filtered;
  }, [categoriesState.categories, direction, category]);

  const options = useMemo<SelectOption[]>(
    () => selectableCategories.map((categoryOption) => ({ label: categoryOption.name, value: categoryOption.id })),
    [selectableCategories],
  );

  // `null` categories = the list has never loaded, so the select has nothing to stand in for
  // it and the skeleton / error strip takes over. A retained list under a FAILED REFETCH keeps
  // the select mounted and gets the strip ABOVE it instead.
  const hasLoaded = categoriesState.categories !== null;
  // A bound `mutate()` refetches with throwOnError, so the retry's second failure is swallowed
  // deliberately — SWR keeps `error` set and this strip stays on screen.
  const retry = () => void categoriesState.refresh?.().catch(() => {});

  return (
    <div className="flex flex-col gap-y-2">
      <span className="text-base">
        Kategori Kas<span className="text-red-500"> *</span>
      </span>

      {!hasLoaded && categoriesState.error && <CategoriesFetchError onRetry={retry} />}
      {!hasLoaded && !categoriesState.error && <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-100" />}

      {hasLoaded && (
        <>
          {categoriesState.error && <CategoriesFetchError onRetry={retry} />}

          <SelectInput
            noLabel
            options={options}
            value={category?.id}
            onChange={(value) => {
              const selected = selectableCategories.find((c) => c.id === value) ?? null;
              selectCategory(selected);
            }}
            placeholder="Pilih kategori kas"
            error={fieldErrors.category ?? null}
            description={options.length === 0 ? EMPTY_FOR_DIRECTION_DESCRIPTION : undefined}
          />

          <SecondaryButton
            outlined
            type="button"
            label="Tambah Kategori"
            leftIcon={<PlusIcon className="size-4" />}
            onClick={openCreateCategoryDialog}
            className="w-fit px-4"
          />

          <CashCategoryCreateDialog />
        </>
      )}
    </div>
  );
}
