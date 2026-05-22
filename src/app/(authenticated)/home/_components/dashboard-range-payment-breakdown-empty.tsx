import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangePaymentBreakdownEmpty() {
  return (
    <SectionCard title="Metode pembayaran">
      <p className="text-sm text-neutral-300">Belum ada pembayaran pada periode ini.</p>
    </SectionCard>
  );
}
