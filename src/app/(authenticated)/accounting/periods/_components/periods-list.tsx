"use client";

import { TableContainer } from "@/core/presentations/components/table/table-container";
import { usePeriods } from "@/app/(authenticated)/accounting/periods/_providers/periods-provider";
import { PeriodsFilterToolbar } from "@/app/(authenticated)/accounting/periods/_components/periods-filter-toolbar";
import { PeriodsLoadingContent } from "@/app/(authenticated)/accounting/periods/_components/periods-loading";
import { PeriodsEmptyContent } from "@/app/(authenticated)/accounting/periods/_components/periods-empty";
import { PeriodsErrorContent } from "@/app/(authenticated)/accounting/periods/_components/periods-error";
import { PeriodsTable } from "@/app/(authenticated)/accounting/periods/_components/periods-table";

export function PeriodsList() {
  const { loading, listError, periods } = usePeriods();

  const isLoading = loading;
  const hasError = !isLoading && listError !== null;
  const isEmpty = !isLoading && !hasError && periods.length === 0;
  const hasData = !isLoading && !hasError && periods.length > 0;

  return (
    <div className="flex flex-col items-start gap-y-4">
      <PeriodsFilterToolbar />
      <div className="w-full">
        {isLoading ? (
          <TableContainer>
            <PeriodsLoadingContent />
          </TableContainer>
        ) : null}
        {hasError ? (
          <TableContainer>
            <PeriodsErrorContent />
          </TableContainer>
        ) : null}
        {isEmpty ? (
          <TableContainer>
            <PeriodsEmptyContent />
          </TableContainer>
        ) : null}
        {hasData ? <PeriodsTable /> : null}
      </div>
    </div>
  );
}
