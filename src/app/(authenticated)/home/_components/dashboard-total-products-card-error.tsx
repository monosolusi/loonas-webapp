"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardTotalProductsCardError() {
  return (
    <SectionCard title="Total Produk">
      <span className="text-sm text-neutral-300">Gagal memuat produk.</span>
    </SectionCard>
  );
}
