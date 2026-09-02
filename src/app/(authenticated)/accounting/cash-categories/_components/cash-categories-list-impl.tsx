"use client";

import Image from "next/image";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { TabFilter } from "@/core/presentations/components/tab-filter";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
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
    openCreate,
  } = useCashCategoriesProvider();

  const selectedTabIndex = DIRECTION_VALUES.indexOf(direction);
  const hasFilter = search.trim() !== "" || direction !== undefined;
  const subtitle = shellState === "error" ? undefined : meta ? `${meta.total} kategori` : "Memuat...";

  // `Button` bakes `w-full` into its base class, and Tailwind v4 emits every utility at the same
  // specificity, so an override only wins by being emitted LATER in the stylesheet. `.w-auto` and
  // `.w-fit` are both emitted BEFORE `.w-full` (class-attribute order is irrelevant), so a plain
  // `w-auto`/`w-fit` does NOT override it. The header instance works only because `sm:w-auto` is a
  // responsive variant, emitted after the base layer; the empty-state instance, which needs
  // content-width at every viewport, must use the v4 important modifier `w-auto!`
  // (`width: auto !important`, the escape hatch `dialog-footer.tsx` documents) — otherwise it
  // spans the whole centered empty column instead of sitting as a compact CTA. See LNS-786 for the
  // ~24 pre-existing call sites with this same bare-`w-auto` bug.
  const createCategoryButton = (className: string) => (
    <PrimaryButton
      label="Tambah Kategori"
      leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
      onClick={openCreate}
      className={className}
    />
  );

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader
        backHref="/accounting"
        title="Kategori Kas"
        subtitle={subtitle}
        action={createCategoryButton("w-full sm:w-auto")}
      />

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
      {shellState === "empty" && (
        <CashCategoriesEmpty hasFilter={hasFilter} action={createCategoryButton("w-auto! px-4")} />
      )}
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
