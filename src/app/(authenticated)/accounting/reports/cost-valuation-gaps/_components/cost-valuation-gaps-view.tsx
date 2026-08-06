"use client";

import { Fragment } from "react";
import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { SummaryCard } from "@/core/presentations/components/summary-card";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { FilterPill } from "@/app/(authenticated)/products/_components/filter-dropdown";
import { ErrorCodes } from "@/core/resources/server-error";
import { useCostValuationGapsProvider } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_providers/cost-valuation-gaps-provider";
import { CostValuationGapRow } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gap-row";
import { CostValuationGapMobileCard } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gap-mobile-card";
import { CostValuationGapsAccessDenied } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gaps-access-denied";

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
    loading,
    error,
  } = useCostValuationGapsProvider();

  // 403 FORBIDDEN from the API → feature unavailable, not a generic failure.
  if (error !== null && error.code === ErrorCodes.FORBIDDEN.code) {
    return <CostValuationGapsAccessDenied />;
  }

  const header = (
    <TableHeader
      columns={[
        { label: "Item" },
        { label: "Tindakan" },
        { label: "Qty Tidak Tercatat", align: "right" },
        { label: "Kejadian / Penjualan" },
        { label: "Periode" },
        { label: "HPP" },
        { label: "Estimasi Koreksi", align: "right" },
        { label: "Akun Koreksi" },
      ]}
      className="grid-cols-[2fr_2fr_0.8fr_0.8fr_1fr_1fr_1fr_1.2fr] min-w-[1100px]"
      hideOnMobile
    />
  );

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
        loading={loading}
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
            <FilterPill label="Semua periode" onRemove={onClearRange} />
          )}
        </div>
      </TableToolbar>

      <TableContainer
        loading={loading}
        error={error !== null}
        empty={rows.length === 0 && !loading && error === null}
        emptyMessage="Belum ada HPP yang belum tercatat."
        scrollable
      >
        {header}
        {rows.map((row) => (
          <Fragment key={`${row.gapKind}-${row.subjectId}`}>
            <CostValuationGapRow row={row} />
            <div className="lg:hidden">
              <CostValuationGapMobileCard row={row} />
            </div>
          </Fragment>
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination
            displayedCount={rows.length}
            meta={meta}
            currentPage={page}
            onPageChange={onPageChange}
          />
        )}
      </TableContainer>
    </div>
  );
}