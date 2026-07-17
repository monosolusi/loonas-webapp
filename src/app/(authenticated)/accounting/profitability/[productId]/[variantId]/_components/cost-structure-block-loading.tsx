"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function CostStructureBlockLoading() {
  return (
    <SectionCard title="Struktur Biaya">
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-row justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="flex flex-row justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="my-1 border-t border-neutral-100" />
        <div className="flex flex-row justify-between">
          <div className="h-4 w-36 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    </SectionCard>
  );
}
