"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { TabFilter } from "@/core/presentations/components/tab-filter";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { useCashCategoriesProvider } from "@/app/(authenticated)/accounting/cash-categories/_providers/cash-categories-provider";
import {
  CashCategoryRow,
  CASH_CATEGORY_GRID_COLUMNS,
} from "@/app/(authenticated)/accounting/cash-categories/_components/cash-category-row";
import { CashCategoriesLoading } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-categories-loading";
import { CashCategoriesError } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-categories-error";
import { CashCategoriesEmpty } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-categories-empty";

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
        <div className="flex flex-col gap-y-4" aria-busy={isLoadingPage}>
          <TableContainer>
            <TableHeader
              columns={[
                { label: "Arah" },
                { label: "Nama Kategori" },
                { label: "Akun" },
                { label: "Jenis" },
                { label: "Aksi", align: "right" },
              ]}
              className={CASH_CATEGORY_GRID_COLUMNS}
              hideOnMobile
            />
            {filteredCategories.map((category) => (
              <CashCategoryRow key={category.id} category={category} onEdit={openEdit} onDelete={openDelete} />
            ))}
            {/* The list endpoint takes `direction` only — no page/limit — so `meta` is
                synthesised with totalPages 1 and this control never mounts. Kept for the
                standard list-page shape. */}
            {meta && meta.totalPages > 1 && (
              <TablePagination
                displayedCount={filteredCategories.length}
                meta={meta}
                currentPage={meta.page}
                onPageChange={() => {}}
              />
            )}
          </TableContainer>
        </div>
      )}
    </div>
  );
}
