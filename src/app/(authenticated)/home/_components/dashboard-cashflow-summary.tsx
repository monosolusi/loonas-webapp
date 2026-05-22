// BE cashflow endpoint not yet available — placeholder until contract lands (LNS-227).
import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardCashflowSummary() {
  return (
    <SectionCard title="Arus Kas" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="py-8 text-center text-sm text-neutral-300">Belum tersedia untuk periode ini</div>
    </SectionCard>
  );
}
