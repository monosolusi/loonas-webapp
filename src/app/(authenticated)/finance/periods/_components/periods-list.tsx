"use client";

import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";
import { PeriodsLoading } from "@/app/(authenticated)/finance/periods/_components/periods-loading";
import { PeriodsEmpty } from "@/app/(authenticated)/finance/periods/_components/periods-empty";
import { PeriodsError } from "@/app/(authenticated)/finance/periods/_components/periods-error";
import { PeriodsTable } from "@/app/(authenticated)/finance/periods/_components/periods-table";

export function PeriodsList() {
  const { loading, listError, periods } = usePeriods();

  const isLoading = loading;
  const hasError = !isLoading && listError !== null;
  const isEmpty = !isLoading && !hasError && periods.length === 0;
  const hasData = !isLoading && !hasError && periods.length > 0;

  if (isLoading) return <PeriodsLoading />;
  if (hasError) return <PeriodsError />;
  if (isEmpty) return <PeriodsEmpty />;
  if (hasData) return <PeriodsTable />;
  return null;
}
