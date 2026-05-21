import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangePaymentBreakdownEmpty() {
  return (
    <SectionCard title="Metode pembayaran">
      <p className="text-sm text-neutral-200">Belum ada penjualan di rentang ini.</p>
    </SectionCard>
  );
}
