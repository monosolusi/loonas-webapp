import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangePaymentBreakdownEmpty() {
  return (
    <SectionCard title="Komposisi pendapatan">
      <p className="text-sm text-neutral-300">Belum ada pendapatan pada periode ini.</p>
    </SectionCard>
  );
}
