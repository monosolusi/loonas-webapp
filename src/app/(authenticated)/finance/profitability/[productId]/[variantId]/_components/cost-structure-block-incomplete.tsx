"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";

export function CostStructureBlockIncomplete() {
  return (
    <SectionCard title="Struktur Biaya">
      <div className="flex flex-col items-start gap-y-2">
        <StatusChip variant="neutral" label="Data Kurang" />
        <p className="text-sm text-neutral-400">
          Data produk belum lengkap. Laba kotor tidak bisa dihitung karena resep atau harga bahan baku produk ini belum
          diisi.
        </p>
      </div>
    </SectionCard>
  );
}
