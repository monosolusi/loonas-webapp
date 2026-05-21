"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { DailyRevenuePoint } from "@/features/dashboard/domain/entities/daily-revenue-point";

type ChartDataPoint = {
  date: string;
  revenue: number;
  transactionCount: number;
  label: string;
  dayName: string;
  dateShort: string;
};

type CustomTickProps = {
  x?: number;
  y?: number;
  payload?: { value: string };
};

function CustomXAxisTick({ x = 0, y = 0, payload }: CustomTickProps) {
  if (!payload?.value) return null;
  const parts = payload.value.split("|");
  const dayName = parts[0] ?? "";
  const dateShort = parts[1] ?? "";

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={14} textAnchor="middle" fill="#BDBDBD" fontSize={10}>
        {dayName}
      </text>
      <text x={0} y={0} dy={26} textAnchor="middle" fill="#BDBDBD" fontSize={10}>
        {dateShort}
      </text>
    </g>
  );
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartDataPoint }>;
};

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const dt = DateTime.fromISO(point.date, { zone: "Asia/Jakarta" }).setLocale("id");
  const formatted = dt.toFormat("ccc, d MMM yyyy");
  const idrFormatted = point.revenue.toLocaleString("id-ID");

  return (
    <div className="rounded-lg border border-neutral-100 bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-neutral-400">{formatted}</p>
      <p className="text-sm font-semibold text-neutral-500">Rp {idrFormatted}</p>
    </div>
  );
}

type DashboardRangeDailyRevenueChartImplProps = {
  series: DailyRevenuePoint[];
  from: string;
  to: string;
};

export function DashboardRangeDailyRevenueChartImpl({ series, from, to }: DashboardRangeDailyRevenueChartImplProps) {
  const chartData = useMemo<ChartDataPoint[]>(() => {
    // Build a map from the series for O(1) lookup
    const seriesMap = new Map<string, DailyRevenuePoint>();
    for (const point of series) {
      seriesMap.set(point.date, point);
    }

    // Generate all dates in the range
    const fromDt = DateTime.fromISO(from, { zone: "Asia/Jakarta" });
    const toDt = DateTime.fromISO(to, { zone: "Asia/Jakarta" });
    const days: ChartDataPoint[] = [];
    let current = fromDt;
    while (current <= toDt) {
      const dateStr = current.toFormat("yyyy-MM-dd");
      const point = seriesMap.get(dateStr);
      const localized = current.setLocale("id");
      days.push({
        date: dateStr,
        revenue: point?.revenue ?? 0,
        transactionCount: point?.transactionCount ?? 0,
        label: `${localized.toFormat("ccc")}|${localized.toFormat("d MMM")}`,
        dayName: localized.toFormat("ccc"),
        dateShort: localized.toFormat("d MMM"),
      });
      current = current.plus({ days: 1 });
    }
    return days;
  }, [series, from, to]);

  return (
    <SectionCard title="Pendapatan harian">
      <div className="h-44" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 28 }}>
            <XAxis
              dataKey="label"
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,123,255,0.05)" }} />
            <Bar dataKey="revenue" minPointSize={4} radius={[3, 3, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.date}
                  fill={entry.revenue > 0 ? "#007BFF" : "#D9DADA"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible screen-reader table fallback */}
      <table className="sr-only">
        <caption>Pendapatan harian</caption>
        <thead>
          <tr>
            <th scope="col">Tanggal</th>
            <th scope="col">Pendapatan (Rp)</th>
            <th scope="col">Transaksi</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((point) => (
            <tr key={point.date}>
              <td>{point.date}</td>
              <td>{point.revenue.toLocaleString("id-ID")}</td>
              <td>{point.transactionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}
