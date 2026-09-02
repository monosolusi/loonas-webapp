"use client";

import { useMemo } from "react";
import { SearchCombobox } from "@/core/presentations/components/search-combobox";
import { useListCashCategories } from "@/features/accounting/presentations/hooks/use-list-cash-category";
import { useCashEntryCreate } from "@/app/(authenticated)/accounting/cash-entries/new/_providers/cash-entry-create-provider";
import { filterCategoriesByDirection } from "@/app/(authenticated)/accounting/cash-entries/new/_utils/filter-categories-by-direction";
import {
  buildCashCategoryOptions,
  CashCategoryOption,
} from "@/app/(authenticated)/accounting/cash-entries/new/_utils/build-cash-category-options";
import { CategoriesFetchError } from "@/app/(authenticated)/accounting/cash-entries/new/_components/categories-fetch-error";
import { CashCategoryCreateDialog } from "@/app/(authenticated)/accounting/cash-entries/new/_components/cash-category-create-dialog";

const EMPTY_FOR_DIRECTION_DESCRIPTION = "Belum ada kategori untuk arah ini. Tambahkan kategori baru.";

export function CashEntryCategoryPicker() {
  const { direction, category, fieldErrors, selectCategory, openCreateCategoryDialog } = useCashEntryCreate();
  const categoriesState = useListCashCategories();

  const options = useMemo<CashCategoryOption[]>(() => {
    const filtered = filterCategoriesByDirection(categoriesState.categories ?? [], direction);
    // The just-created category is auto-selected before the fire-and-forget list refetch lands,
    // so the current selection is folded back into its own option list — a combobox must never
    // hold a value its options cannot render.
    const selected = category && category.direction === direction ? category : null;
    return buildCashCategoryOptions(filtered, selected);
  }, [categoriesState.categories, direction, category]);

  const selectedOption = options.find((option) => option.id === category?.id) ?? null;

  // `null` categories = the list has never loaded, so the combobox has nothing to stand in for
  // it and the skeleton / error strip takes over. A retained list under a FAILED REFETCH keeps
  // the combobox mounted and gets the strip ABOVE it instead.
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

          <SearchCombobox<CashCategoryOption>
            noLabel
            options={options}
            value={selectedOption}
            onChange={(option) => selectCategory(option ? option.entity : null)}
            placeholder="Cari kategori..."
            required
            emptyMessage={options.length === 0 ? EMPTY_FOR_DIRECTION_DESCRIPTION : "Tidak ada kategori yang cocok"}
            onCreateNew={openCreateCategoryDialog}
            createNewLabel="+ Tambah Kategori"
          />
          {/* Error outranks the hint — the combobox surfaces neither on its own, so exactly one
              of these siblings renders (mirrors TextInput's error-over-description contract). */}
          {fieldErrors.category ? (
            <span className="text-xs leading-4 font-normal text-red-500" role="alert">
              {fieldErrors.category}
            </span>
          ) : (
            options.length === 0 && (
              <span className="text-xs leading-4 font-normal text-neutral-200">{EMPTY_FOR_DIRECTION_DESCRIPTION}</span>
            )
          )}

          <CashCategoryCreateDialog />
        </>
      )}
    </div>
  );
}
