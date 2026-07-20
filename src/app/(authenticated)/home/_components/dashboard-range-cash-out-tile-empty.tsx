import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeCashOutTileEmpty() {
  return (
    <SectionCard title="Kas keluar">
      <p className="text-sm text-neutral-300">Belum ada kas keluar pada periode ini.</p>
    </SectionCard>
  );
}
