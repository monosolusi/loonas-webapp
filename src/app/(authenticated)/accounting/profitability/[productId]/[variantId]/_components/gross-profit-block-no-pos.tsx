"use client";

import Link from "next/link";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";

export function GrossProfitBlockNoPos() {
  return (
    <SectionCard title="Laba Kotor">
      <div className="flex flex-col items-start gap-y-3">
        <div className="flex flex-row items-center gap-x-2">
          <ChartBarIcon className="size-6 text-neutral-200" />
          <StatusChip variant="neutral" label="Belum Ada Penjualan" compact />
        </div>
        <p className="text-sm font-semibold text-neutral-500">Belum ada penjualan POS</p>
        <p className="text-sm text-neutral-300">
          Laba kotor akan muncul setelah produk ini terjual melalui POS Loonas.
        </p>
        <Link href="/pos" className="text-sm text-primary-300 underline hover:text-primary-400">
          Buka POS
        </Link>
      </div>
    </SectionCard>
  );
}
