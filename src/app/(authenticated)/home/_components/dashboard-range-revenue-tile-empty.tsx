import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeRevenueTileEmpty() {
  return (
    <SectionCard title="Ringkasan Periode">
      <p className="text-sm text-neutral-300">Belum ada pendapatan untuk periode ini.</p>
    </SectionCard>
  );
}
