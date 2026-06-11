"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardLowStockCardEmpty() {
  return (
    <SectionCard title="Stok Menipis" bodyClassName="p-0">
      <div className="py-8 text-center text-sm text-neutral-300">Tidak ada produk yang menipis.</div>
    </SectionCard>
  );
}
