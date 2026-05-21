"use client";

import dynamic from "next/dynamic";
import { mutate } from "swr";
import { useGetRevenueSeries } from "@/features/dashboard/presentations/hooks/use-get-revenue-series";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangeDailyRevenueChartLoading } from "@/app/(authenticated)/home/_components/dashboard-range-daily-revenue-chart-loading";
import { DashboardRangeDailyRevenueChartEmpty } from "@/app/(authenticated)/home/_components/dashboard-range-daily-revenue-chart-empty";
import { DashboardRangeDailyRevenueChartError } from "@/app/(authenticated)/home/_components/dashboard-range-daily-revenue-chart-error";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";

const DashboardRangeDailyRevenueChartImpl = dynamic(
  () =>
    import("@/app/(authenticated)/home/_components/dashboard-range-daily-revenue-chart-impl").then(
      (mod) => mod.DashboardRangeDailyRevenueChartImpl,
    ),
  {
    ssr: false,
    loading: () => <DashboardRangeDailyRevenueChartLoading />,
  },
);

export function DashboardRangeDailyRevenueChart() {
  const { from, to } = useDashboardRange();
  const result = useGetRevenueSeries({ from, to });

  if (result.loading) return <DashboardRangeDailyRevenueChartLoading />;
  if (result.error) {
    return (
      <DashboardRangeDailyRevenueChartError
        onRetry={() => mutate([DASHBOARD_SWR_KEYS.DASHBOARD_REVENUE_SERIES, from, to])}
      />
    );
  }

  const hasData = result.series && result.series.some((p) => p.revenue > 0);
  if (!hasData) return <DashboardRangeDailyRevenueChartEmpty />;

  return <DashboardRangeDailyRevenueChartImpl series={result.series!} from={from} to={to} />;
}
