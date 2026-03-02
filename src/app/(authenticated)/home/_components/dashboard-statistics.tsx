"use client";

import clsx from "clsx";
import { useGetDashboardStatistics } from "@/features/dashboard/presentations/hooks/use-get-dashboard-statistics";

function toCompactIDR(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    const n = abs / 1_000_000_000;
    return `${sign}Rp${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1).replace(".", ",")}M`;
  }
  if (abs >= 1_000_000) {
    const n = abs / 1_000_000;
    return `${sign}Rp${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1).replace(".", ",")}Jt`;
  }
  if (abs >= 1_000) {
    const n = abs / 1_000;
    return `${sign}Rp${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1).replace(".", ",")}Rb`;
  }
  return `${sign}Rp${abs}`;
}

const themeClasses = {
  primary: {
    borderBottom: "border-b-primary-200/50",
    borderSide: "border-primary-50 border-primary-200/60",
    subtext: "text-primary-300",
  },
  warning: {
    borderBottom: "border-b-warning-200/50",
    borderSide: "border-warning-50 border-warning-200/60",
    subtext: "text-warning-400",
  },
  error: {
    borderBottom: "border-b-red-200/50",
    borderSide: "border-red-50 border-red-200/60",
    subtext: "text-red-400",
  },
};

interface StatCard {
  label: string;
  value: string;
  subtitle: string;
  theme: keyof typeof themeClasses;
}

function StatCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-y-3 rounded-xl border border-t border-r border-b-4 border-l border-neutral-100 bg-neutral-50 p-5">
      <div className="h-5 w-20 rounded bg-neutral-100" />
      <div className="flex flex-col gap-y-1.5">
        <div className="h-8 w-32 rounded bg-neutral-100" />
        <div className="h-4 w-24 rounded bg-neutral-100" />
      </div>
    </div>
  );
}

export function DashboardStatistics() {
  const { statistics, loading } = useGetDashboardStatistics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const revenueSubtitle = (() => {
    if (!statistics) return "-";
    if (statistics.revenue.changes !== null) {
      const sign = statistics.revenue.changes >= 0 ? "+" : "";
      return `${sign}${statistics.revenue.changes}% dari bulan lalu`;
    }
    return `Bulan lalu: ${toCompactIDR(statistics.revenue.lastMonthAmount)}`;
  })();

  const stats: StatCard[] = [
    {
      label: "Piutang",
      value: toCompactIDR(statistics?.piutang.amount ?? 0),
      subtitle: `dari ${statistics?.piutang.count ?? 0} faktur`,
      theme: "primary",
    },
    {
      label: "Hutang",
      value: toCompactIDR(statistics?.hutang.amount ?? 0),
      subtitle: `dari ${statistics?.hutang.count ?? 0} faktur`,
      theme: "warning",
    },
    {
      label: "Revenue",
      value: toCompactIDR(statistics?.revenue.amount ?? 0),
      subtitle: revenueSubtitle,
      theme: "error",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const theme = themeClasses[stat.theme];
        return (
          <div
            key={stat.label}
            className={clsx(
              "flex flex-col gap-y-3 rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5",
              theme.borderBottom,
              theme.borderSide,
            )}
          >
            <span className="text-sm leading-5 text-neutral-300">{stat.label}</span>
            <div className="flex flex-col gap-y-1.5">
              <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">{stat.value}</span>
              <span className={clsx("text-xs leading-4", theme.subtext)}>{stat.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
