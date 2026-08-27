"use client";

import Image from "next/image";
import Link from "next/link";
import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { FilterPill } from "@/core/presentations/components/filter-pill";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { TabFilter } from "@/core/presentations/components/tab-filter";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { useCashEntriesListProvider } from "@/app/(authenticated)/accounting/cash-entries/_providers/cash-entries-list-provider";
import { CashEntriesLoading } from "@/app/(authenticated)/accounting/cash-entries/_components/cash-entries-loading";
import { CashEntriesError } from "@/app/(authenticated)/accounting/cash-entries/_components/cash-entries-error";
import { CashEntriesEmpty } from "@/app/(authenticated)/accounting/cash-entries/_components/cash-entries-empty";
import { CashEntriesTable } from "@/app/(authenticated)/accounting/cash-entries/_components/cash-entries-table";
import { formatCashEntryRange } from "@/app/(authenticated)/accounting/cash-entries/_utils/format-cash-entry-range";

// TabFilter is index-based, so the tab labels and the direction values they represent are kept
// as parallel tuples (index 0 = "Semua" = no filter), mirroring
// `outgoing-invoice-table-impl.tsx`'s `FILTER_TABS`/`filterMap`.
const DIRECTION_TABS = ["Semua", "Kas Masuk", "Kas Keluar"] as const;
const DIRECTION_VALUES = [undefined, CashEntryDirection.In, CashEntryDirection.Out] as const;

export function CashEntriesView() {
  const {
    dateRange,
    onRangeChange,
    onClearRange,
    hasDateFilter,
    direction,
    onDirectionChange,
    page,
    onPageChange,
    entries,
    meta,
    shellState,
    isLoadingPage,
    pageError,
    onRetry,
  } = useCashEntriesListProvider();

  const selectedTabIndex = DIRECTION_VALUES.indexOf(direction);
  const periodLabel = formatCashEntryRange(dateRange);
  const hasFilter = hasDateFilter || direction !== undefined;

  const handleTabChange = (index: number) => {
    onDirectionChange(DIRECTION_VALUES[index]);
  };

  // "Memuat..." only describes the first-load state; a first-load failure has no meta and must
  // not claim the page is still loading while the error state below offers "Coba Lagi".
  const subtitle = shellState === "error" ? undefined : meta ? `${meta.total} entri` : "Memuat...";

  return (
    <div className="flex flex-col gap-y-6">
      <ListPageHeader
        title="Kas Masuk & Kas Keluar"
        subtitle={subtitle}
        action={
          <Link href="/accounting/cash-entries/new" className="w-full sm:w-auto">
            <PrimaryButton
              label="Catat Kas"
              leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
              className="w-full sm:w-auto"
            />
          </Link>
        }
      />

      <TableToolbar>
        <div className="flex flex-row flex-wrap items-center gap-3">
          <TabFilter tabs={DIRECTION_TABS} selectedIndex={selectedTabIndex} onChange={handleTabChange} />
          <DateRangePicker value={dateRange} onChange={onRangeChange} maxSpanDays={365} disableFutureDates={false} />
          {hasDateFilter && <FilterPill label={periodLabel} onRemove={onClearRange} />}
        </div>
      </TableToolbar>

      {/* A failed refetch (keepPreviousData retains stale/empty rows) must surface here, above
          every shellState branch — pageError is only ever non-null alongside "empty" or
          "success", never "error" (that state requires no retained data), so this never
          double-renders against CashEntriesError below. */}
      {pageError && (
        <div className="flex flex-row items-center gap-x-2 rounded-lg border border-error-300 bg-error-50 px-4 py-2 text-sm text-error-400">
          <span>Gagal memuat halaman ini.</span>
          <button type="button" onClick={onRetry} className="font-medium underline hover:no-underline">
            Muat ulang
          </button>
        </div>
      )}

      {shellState === "loading" && <CashEntriesLoading />}
      {shellState === "error" && <CashEntriesError onRetry={onRetry} />}
      {shellState === "empty" && <CashEntriesEmpty hasFilter={hasFilter} />}
      {shellState === "success" && (
        <CashEntriesTable
          entries={entries}
          meta={meta}
          page={page}
          onPageChange={onPageChange}
          isLoadingPage={isLoadingPage}
        />
      )}
    </div>
  );
}
