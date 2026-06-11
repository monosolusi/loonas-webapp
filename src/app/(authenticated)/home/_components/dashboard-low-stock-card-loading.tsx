"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-3 border-b border-neutral-100 px-6 py-4 last:border-b-0">
      <div className="size-5 shrink-0 rounded bg-neutral-100" />
      <div className="flex flex-1 flex-col gap-1">
        <div className="h-4 w-32 rounded bg-neutral-100" />
        <div className="h-3 w-20 rounded bg-neutral-100" />
      </div>
      <div className="h-4 w-16 rounded bg-neutral-100" />
    </div>
  );
}

export function DashboardLowStockCardLoading() {
  return (
    <SectionCard title="Stok Menipis" bodyClassName="p-0">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </SectionCard>
  );
}
