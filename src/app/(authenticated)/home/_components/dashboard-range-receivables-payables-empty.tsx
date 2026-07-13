import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeReceivablesPayablesEmpty() {
  return (
    <SectionCard title="Piutang & Hutang">
      <p className="text-sm text-neutral-300">Belum ada piutang atau hutang pada periode ini.</p>
    </SectionCard>
  );
}
