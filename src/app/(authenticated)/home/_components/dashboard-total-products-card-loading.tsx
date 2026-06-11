"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardTotalProductsCardLoading() {
  return (
    <SectionCard title="Total Produk">
      <div className="flex animate-pulse flex-col gap-y-2">
        <div className="h-8 w-16 rounded bg-neutral-100" />
      </div>
    </SectionCard>
  );
}
