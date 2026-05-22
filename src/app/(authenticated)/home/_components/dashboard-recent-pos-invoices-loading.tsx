"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0">
      <div className="flex flex-col gap-1">
        <div className="h-5 w-32 animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="h-5 w-24 animate-pulse rounded bg-neutral-100" />
      <div className="h-5 w-20 animate-pulse rounded bg-neutral-100" />
    </div>
  );
}

export function DashboardRecentPosInvoicesLoading() {
  return (
    <SectionCard title="Transaksi POS Terbaru" bodyClassName="p-0">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </SectionCard>
  );
}
