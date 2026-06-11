"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { DailyRevenuePoint } from "@/features/dashboard/domain/entities/daily-revenue-point";

type DashboardRangeDailyRevenueStatProps = {
  series: DailyRevenuePoint[];
};

export function DashboardRangeDailyRevenueStat({ series }: DashboardRangeDailyRevenueStatProps) {
  const { activeDays, peak } = useMemo(() => {
    const active = series.filter((p) => p.revenue > 0);
    const peakPoint = active.reduce<DailyRevenuePoint | null>((max, p) => {
      if (!max || p.revenue > max.revenue) return p;
      return max;
    }, null);
    return { activeDays: active.length, peak: peakPoint };
  }, [series]);

  const peakLabel = useMemo(() => {
    if (!peak) return null;
    return DateTime.fromISO(peak.date, { zone: "Asia/Jakarta" }).setLocale("id").toFormat("ccc, d MMM");
  }, [peak]);

  return (
    <SectionCard title="Pendapatan harian">
      <div className="flex flex-col gap-y-4 sm:flex-row sm:items-end sm:justify-between sm:gap-x-6">
        <div className="flex flex-col gap-y-1">
          <span className="text-2xl leading-tight font-bold text-neutral-500">{activeDays} hari ada penjualan</span>
          <span className="text-sm text-neutral-300">periode ini</span>
        </div>
        {peak && peakLabel && (
          <div className="flex flex-col gap-y-1 sm:items-end">
            <span className="text-sm text-neutral-300">Hari terbaik: {peakLabel}</span>
            <span className="text-base font-semibold text-neutral-500">
              <NumberDisplay value={peak.revenue} prefix="Rp" />
            </span>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
