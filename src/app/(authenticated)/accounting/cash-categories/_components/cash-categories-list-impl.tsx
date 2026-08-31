"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { TabFilter } from "@/core/presentations/components/tab-filter";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { useCashCategoriesProvider } from "@/app/(authenticated)/accounting/cash-categories/_providers/cash-categories-provider";
import { CashCategoriesLoading } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-categories-loading";
import { CashCategoriesError } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-categories-error";
import { CashCategoriesEmpty } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-categories-empty";
import { CashCategoriesTable } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-categories-table";

// TabFilter is index-based, so the tab labels and the direction values they represent are kept
// as parallel tuples (index 0 = "Semua" = no filter), mirroring `cash-entries-view.tsx`.
const DIRECTION_TABS = ["Semua", "Kas Masuk", "Kas Keluar"] as const;
const DIRECTION_VALUES = [undefined, CashEntryDirection.In, CashEntryDirection.Out] as const;

export function CashCategoriesListImpl() {
  const {
    direction,
    onDirectionChange,
    search,
    onSearchChange,
    meta,
    filteredCategories,
    shellState,
    isLoadingPage,
    pageError,
    onRetry,
    openEdit,
    openDelete,
  } = useCashCategoriesProvider();

  const selectedTabIndex = DIRECTION_VALUES.indexOf(direction);
  const hasFilter = search.trim() !== "" || direction !== undefined;
  const subtitle = shellState === "error" ? undefined : meta ? `${meta.total} kategori` : "Memuat...";

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader backHref="/accounting" title="Kategori Kas" subtitle={subtitle} />

      <TableToolbar>
        <div className="flex flex-row flex-wrap items-center gap-3">
          <TabFilter
            tabs={DIRECTION_TABS}
            selectedIndex={selectedTabIndex}
            onChange={(index) => onDirectionChange(DIRECTION_VALUES[index])}
          />
        </div>
        <TableSearch value={search} onChange={onSearchChange} placeholder="Cari kategori..." />
      </TableToolbar>

      {/* A failed refetch (keepPreviousData retains stale/empty rows) must surface here, above
          every shellState branch — pageError is only ever non-null alongside "empty" or
          "success", never "error" (that state requires no retained data), so this never
          double-renders against the first-load error card below. */}
      {pageError && (
        <div className="border-error-300 bg-error-50 text-error-400 flex flex-row items-center gap-x-2 rounded-lg border px-4 py-2 text-sm">
          <span>Gagal memuat halaman ini.</span>
          <button type="button" onClick={onRetry} className="font-medium underline hover:no-underline">
            Muat ulang
          </button>
        </div>
      )}

      {shellState === "loading" && <CashCategoriesLoading />}
      {shellState === "error" && <CashCategoriesError onRetry={onRetry} />}
      {shellState === "empty" && <CashCategoriesEmpty hasFilter={hasFilter} />}
      {shellState === "success" && (
        <CashCategoriesTable
          categories={filteredCategories}
          meta={meta}
          isLoadingPage={isLoadingPage}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}
    </div>
  );
}
