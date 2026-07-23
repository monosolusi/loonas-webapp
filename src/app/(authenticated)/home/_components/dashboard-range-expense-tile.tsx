"use client";

// Accrual operating expense (Beban, Laba-Rugi basis) for the selected period — sourced from
// GET /dashboard `expense`. Amount excludes PPh Final tax (surfaced separately as Pajak in the
// Laba usaha card). MoM trend is inverted: a rise in expense reads as caution, not success.

import { useMemo } from "react";
import { mutate } from "swr";
import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useGetDashboardStatistics } from "@/features/dashboard/presentations/hooks/use-get-dashboard-statistics";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangeExpenseTileLoading } from "@/app/(authenticated)/home/_components/dashboard-range-expense-tile-loading";
import { DashboardRangeExpenseTileEmpty } from "@/app/(authenticated)/home/_components/dashboard-range-expense-tile-empty";
import { DashboardRangeExpenseTileError } from "@/app/(authenticated)/home/_components/dashboard-range-expense-tile-error";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";
import { computeMomTrend } from "@/app/(authenticated)/home/_components/dashboard-mom-trend";
import { DashboardMomTrendChip } from "@/app/(authenticated)/home/_components/dashboard-mom-trend-chip";

export function DashboardRangeExpenseTile() {
  const { from, to } = useDashboardRange();
  const result = useGetDashboardStatistics({ from, to });

  const amount = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    return result.statistics.expense.amount;
  }, [result]);

  const trend = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    return computeMomTrend(result.statistics.expense.changes, { noun: "Beban", invert: true });
  }, [result]);

  if (result.loading) return <DashboardRangeExpenseTileLoading />;
  if (result.error) {
    return (
      <DashboardRangeExpenseTileError
        onRetry={() => mutate((key) => Array.isArray(key) && key[0] === DASHBOARD_SWR_KEYS.DASHBOARD_STATISTICS)}
      />
    );
  }
  if (amount === null || amount === 0) return <DashboardRangeExpenseTileEmpty />;

  return (
    <SectionCard title="Beban">
      <dl className="flex flex-col gap-y-1">
        <dt className="sr-only">Total beban operasional pada periode ini</dt>
        <dd className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-2xl leading-tight font-bold tracking-tight text-neutral-500">
            <NumberDisplay value={amount} prefix="Rp" />
          </span>
          {trend && <DashboardMomTrendChip trend={trend} />}
        </dd>
        <dd className="text-sm text-neutral-300">beban operasional · periode ini</dd>
      </dl>
    </SectionCard>
  );
}
