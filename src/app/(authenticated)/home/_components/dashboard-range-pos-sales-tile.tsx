"use client";

import { useMemo } from "react";
import { mutate } from "swr";
import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useGetRevenueSeries } from "@/features/dashboard/presentations/hooks/use-get-revenue-series";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangePosSalesTileLoading } from "@/app/(authenticated)/home/_components/dashboard-range-pos-sales-tile-loading";
import { DashboardRangePosSalesTileEmpty } from "@/app/(authenticated)/home/_components/dashboard-range-pos-sales-tile-empty";
import { DashboardRangePosSalesTileError } from "@/app/(authenticated)/home/_components/dashboard-range-pos-sales-tile-error";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";

export function DashboardRangePosSalesTile() {
  const { from, to } = useDashboardRange();
  const result = useGetRevenueSeries({ from, to });

  const totals = useMemo(() => {
    if (result.loading || result.error || !result.series) return null;
    return result.series.reduce(
      (acc, point) => ({
        revenue: acc.revenue + point.revenue,
        transactionCount: acc.transactionCount + point.transactionCount,
      }),
      { revenue: 0, transactionCount: 0 },
    );
  }, [result]);

  if (result.loading) return <DashboardRangePosSalesTileLoading />;
  if (result.error) {
    return (
      <DashboardRangePosSalesTileError
        onRetry={() => mutate([DASHBOARD_SWR_KEYS.DASHBOARD_REVENUE_SERIES, from, to])}
      />
    );
  }
  if (!totals || totals.transactionCount === 0) return <DashboardRangePosSalesTileEmpty />;

  return (
    <SectionCard title="Penjualan POS lunas">
      <dl className="flex flex-col gap-y-1">
        <dt className="sr-only">Total transaksi POS lunas</dt>
        <dd className="text-3xl leading-tight font-bold tracking-tight text-neutral-500">
          {totals.transactionCount}
        </dd>
        <dd className="text-sm text-neutral-300">
          transaksi &middot; <NumberDisplay value={totals.revenue} prefix="Rp" />
        </dd>
      </dl>
    </SectionCard>
  );
}
