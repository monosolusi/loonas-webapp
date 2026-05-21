import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeRevenueTileEmpty() {
  return (
    <SectionCard title="Penjualan POS (lunas)">
      <p className="text-sm text-neutral-200">Belum ada penjualan di rentang ini.</p>
    </SectionCard>
  );
}
