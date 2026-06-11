import Link from "next/link";
import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangePosSalesTileEmpty() {
  return (
    <SectionCard title="Penjualan POS">
      <div className="flex flex-col gap-y-3">
        <p className="text-sm text-neutral-300">Belum ada penjualan POS lunas pada periode ini.</p>
        <Link
          href="/pos"
          className="w-fit text-sm font-medium text-primary-300 hover:underline"
        >
          Buka POS
        </Link>
      </div>
    </SectionCard>
  );
}
