import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeDailyRevenueChartEmpty() {
  return (
    <SectionCard title="Pendapatan harian">
      <p className="text-sm text-neutral-200">Belum ada penjualan di rentang ini.</p>
    </SectionCard>
  );
}
