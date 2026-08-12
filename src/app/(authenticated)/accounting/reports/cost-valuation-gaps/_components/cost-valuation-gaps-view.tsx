"use client";

import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { FilterPill } from "@/core/presentations/components/filter-pill";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { SummaryCard } from "@/core/presentations/components/summary-card";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { useCostValuationGapsProvider } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_providers/cost-valuation-gaps-provider";
import { CostValuationGapsAccessDenied } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gaps-access-denied";
import { CostValuationGapsError } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gaps-error";
import { CostValuationGapsLoading } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gaps-loading";
import { CostValuationGapsEmpty } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gaps-empty";
import { CostValuationGapsTable } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gaps-table";
import { formatGapRange } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_utils/format-date";

export function CostValuationGapsView() {
  const {
    dateRange,
    onRangeChange,
    onClearRange,
    hasDateFilter,
    page,
    onPageChange,
    rows,
    meta,
    shellState,
    accessDenied,
    isLoadingPage,
    pageError,
    onRetry,
  } = useCostValuationGapsProvider();

  // 403 FORBIDDEN from the API → feature unavailable, not a generic failure.
  if (accessDenied) return <CostValuationGapsAccessDenied />;

  const periodLabel = formatGapRange(dateRange);

  return (
    <div className="flex flex-col gap-y-6">
      <ListPageHeader
        title="HPP Belum Tercatat"
        subtitle={meta ? `${meta.total} item` : "Memuat..."}
      />

      <SummaryCard
        label="Item Terdampang"
        value={meta ? String(meta.total) : "—"}
        variant="warning"
        subtitle="Total item dengan kesenjangan biaya"
        loading={shellState === "loading"}
      />

      <TableToolbar>
        <div className="flex flex-row flex-wrap items-center gap-3">
          <DateRangePicker
            value={dateRange}
            onChange={onRangeChange}
            maxSpanDays={365}
            disableFutureDates={false}
          />
          {hasDateFilter && (
            <FilterPill label={periodLabel} onRemove={onClearRange} />
          )}
        </div>
      </TableToolbar>

      {shellState === "loading" && <CostValuationGapsLoading />}
      {shellState === "error" && <CostValuationGapsError onRetry={onRetry} />}
      {shellState === "empty" && <CostValuationGapsEmpty />}
      {shellState === "success" && (
        <CostValuationGapsTable
          rows={rows}
          meta={meta}
          page={page}
          onPageChange={onPageChange}
          isLoadingPage={isLoadingPage}
          pageError={pageError}
          onRetry={onRetry}
        />
      )}
    </div>
  );
}