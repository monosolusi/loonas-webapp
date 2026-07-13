"use client";

// Note: file/component name kept as "pos-sales-tile" for import stability, but this now renders the
// all-channel accrual **Pendapatan** (revenue) figure sourced from GET /dashboard statistics — not
// POS-only paid sales. Amount + transaction count reconcile with the "Komposisi pendapatan" card.

import { useMemo } from "react";
import { mutate } from "swr";
import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { useGetDashboardStatistics } from "@/features/dashboard/presentations/hooks/use-get-dashboard-statistics";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangePosSalesTileLoading } from "@/app/(authenticated)/home/_components/dashboard-range-pos-sales-tile-loading";
import { DashboardRangePosSalesTileEmpty } from "@/app/(authenticated)/home/_components/dashboard-range-pos-sales-tile-empty";
import { DashboardRangePosSalesTileError } from "@/app/(authenticated)/home/_components/dashboard-range-pos-sales-tile-error";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";

export function DashboardRangePosSalesTile() {
  const { from, to } = useDashboardRange();
  const result = useGetDashboardStatistics({ from, to });

  const totals = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    const stats = result.statistics;
    const transactionCount = stats.salesBreakdown.reduce((acc, item) => acc + item.transactionCount, 0);
    return { revenue: stats.revenue.amount, transactionCount };
  }, [result]);

  // MoM trend from revenue.changes (percentage vs the prior period; null when there is no baseline).
  const trend = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    const changes = result.statistics.revenue.changes;
    if (changes === null || changes === undefined) return null;
    const pct = Math.abs(Math.round(changes));
    if (pct === 0) {
      return { variant: "neutral" as const, label: "0%", srText: "Pendapatan sama dengan bulan lalu" };
    }
    const up = changes > 0;
    return {
      variant: up ? ("success" as const) : ("error" as const),
      label: `${up ? "↑" : "↓"} ${pct}%`,
      srText: `Pendapatan ${up ? "naik" : "turun"} ${pct}% dibanding bulan lalu`,
    };
  }, [result]);

  if (result.loading) return <DashboardRangePosSalesTileLoading />;
  if (result.error) {
    return (
      <DashboardRangePosSalesTileError
        onRetry={() => mutate((key) => Array.isArray(key) && key[0] === DASHBOARD_SWR_KEYS.DASHBOARD_STATISTICS)}
      />
    );
  }
  if (!totals || totals.transactionCount === 0) return <DashboardRangePosSalesTileEmpty />;

  return (
    <SectionCard title="Pendapatan">
      <dl className="flex flex-col gap-y-1">
        <dt className="sr-only">Total pendapatan pada periode ini</dt>
        <dd className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-2xl leading-tight font-bold tracking-tight text-neutral-500">
            <NumberDisplay value={totals.revenue} prefix="Rp" />
          </span>
          {trend && (
            <span className="flex items-center gap-x-1.5">
              <span className="sr-only">{trend.srText}</span>
              <span aria-hidden="true" className="flex items-center gap-x-1.5">
                <StatusChip variant={trend.variant} label={trend.label} compact />
                <span className="text-xs text-neutral-300">vs bulan lalu</span>
              </span>
            </span>
          )}
        </dd>
        <dd className="text-sm text-neutral-300">dari {totals.transactionCount} transaksi · periode ini</dd>
      </dl>
    </SectionCard>
  );
}
