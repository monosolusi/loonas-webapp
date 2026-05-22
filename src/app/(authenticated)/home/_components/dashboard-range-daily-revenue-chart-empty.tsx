import Link from "next/link";
import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeDailyRevenueChartEmpty() {
  return (
    <SectionCard title="Pendapatan harian">
      <div className="flex flex-col gap-y-3">
        <p className="text-sm text-neutral-300">Belum ada pendapatan untuk periode ini.</p>
        <Link
          href="/pos"
          className="w-fit text-sm font-medium text-primary-300 hover:underline"
        >
          Buat transaksi di POS
        </Link>
      </div>
    </SectionCard>
  );
}
