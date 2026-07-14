"use client";

// Cash outflow (Kas keluar, Arus-Kas basis) for the selected period — sourced from GET /dashboard
// `kas_keluar`. This is a cash-basis figure (credits to Kas & Bank), distinct from the accrual Beban.
// MoM trend is inverted: a rise in cash out reads as caution, not success.

import { useMemo } from "react";
import { mutate } from "swr";
import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useGetDashboardStatistics } from "@/features/dashboard/presentations/hooks/use-get-dashboard-statistics";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangeCashOutTileLoading } from "@/app/(authenticated)/home/_components/dashboard-range-cash-out-tile-loading";
import { DashboardRangeCashOutTileEmpty } from "@/app/(authenticated)/home/_components/dashboard-range-cash-out-tile-empty";
import { DashboardRangeCashOutTileError } from "@/app/(authenticated)/home/_components/dashboard-range-cash-out-tile-error";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";
import { computeMomTrend } from "@/app/(authenticated)/home/_components/dashboard-mom-trend";
import { DashboardMomTrendChip } from "@/app/(authenticated)/home/_components/dashboard-mom-trend-chip";

export function DashboardRangeCashOutTile() {
  const { from, to } = useDashboardRange();
  const result = useGetDashboardStatistics({ from, to });

  const amount = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    return result.statistics.kasKeluar.amount;
  }, [result]);

  const trend = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    return computeMomTrend(result.statistics.kasKeluar.changes, { noun: "Kas keluar", invert: true });
  }, [result]);

  if (result.loading) return <DashboardRangeCashOutTileLoading />;
  if (result.error) {
    return (
      <DashboardRangeCashOutTileError
        onRetry={() => mutate((key) => Array.isArray(key) && key[0] === DASHBOARD_SWR_KEYS.DASHBOARD_STATISTICS)}
      />
    );
  }
  if (amount === null || amount === 0) return <DashboardRangeCashOutTileEmpty />;

  return (
    <SectionCard title="Kas keluar">
      <dl className="flex flex-col gap-y-1">
        <dt className="sr-only">Total kas keluar pada periode ini</dt>
        <dd className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-2xl leading-tight font-bold tracking-tight text-neutral-500">
            <NumberDisplay value={amount} prefix="Rp" />
          </span>
          {trend && <DashboardMomTrendChip trend={trend} />}
        </dd>
        <dd className="text-sm text-neutral-300">arus kas keluar · periode ini</dd>
      </dl>
    </SectionCard>
  );
}
