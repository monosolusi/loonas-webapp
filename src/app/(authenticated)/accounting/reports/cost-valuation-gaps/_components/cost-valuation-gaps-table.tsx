"use client";

import { Fragment } from "react";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { CostValuationGapRowEntity } from "@/features/accounting/domain/entities/cost-valuation-gap";
import { CostValuationGapRow } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gap-row";
import { CostValuationGapMobileCard } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gap-mobile-card";

type CostValuationGapsTableProps = {
  rows: CostValuationGapRowEntity[];
  meta: PaginationMeta | null;
  page: number;
  onPageChange: (page: number) => void;
  isLoadingPage: boolean;
  pageError: ServerError | null;
  onRetry: () => void;
};

export function CostValuationGapsTable({
  rows,
  meta,
  page,
  onPageChange,
  isLoadingPage,
  pageError,
  onRetry,
}: CostValuationGapsTableProps) {
  return (
    <div className="flex flex-col gap-y-4" aria-busy={isLoadingPage}>
      {pageError && (
        <div className="flex flex-row items-center gap-x-2 rounded-lg border border-error-300 bg-error-50 px-4 py-2 text-sm text-error-400">
          <span>Gagal memuat halaman ini.</span>
          <button type="button" onClick={onRetry} className="font-medium underline hover:no-underline">
            Muat ulang
          </button>
        </div>
      )}
      <TableContainer scrollable>
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
        {rows.map((row) => (
          <Fragment key={`${row.gapKind}-${row.subjectId}-${row.cause}`}>
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