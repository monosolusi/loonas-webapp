"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";
import { PeriodsFilterToolbar } from "@/app/(authenticated)/finance/periods/_components/periods-filter-toolbar";
import { PeriodsLoadingContent } from "@/app/(authenticated)/finance/periods/_components/periods-loading";
import { PeriodsEmptyContent } from "@/app/(authenticated)/finance/periods/_components/periods-empty";
import { PeriodsErrorContent } from "@/app/(authenticated)/finance/periods/_components/periods-error";
import { PeriodsTable } from "@/app/(authenticated)/finance/periods/_components/periods-table";

export function PeriodsList() {
  const { loading, listError, periods } = usePeriods();

  const isLoading = loading;
  const hasError = !isLoading && listError !== null;
  const isEmpty = !isLoading && !hasError && periods.length === 0;
  const hasData = !isLoading && !hasError && periods.length > 0;

  return (
    <div className="flex flex-col items-start gap-y-4">
      <PeriodsFilterToolbar />
      <SectionCard title="Periode Akuntansi" className="w-full">
        {isLoading ? <PeriodsLoadingContent /> : null}
        {hasError ? <PeriodsErrorContent /> : null}
        {isEmpty ? <PeriodsEmptyContent /> : null}
        {hasData ? <PeriodsTable /> : null}
      </SectionCard>
    </div>
  );
}
