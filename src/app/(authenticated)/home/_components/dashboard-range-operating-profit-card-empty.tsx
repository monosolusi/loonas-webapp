import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeOperatingProfitCardEmpty() {
  return (
    <SectionCard title="Laba usaha">
      <p className="text-sm text-neutral-300">Belum ada pendapatan atau beban pada periode ini.</p>
    </SectionCard>
  );
}
