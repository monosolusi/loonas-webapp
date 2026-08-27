"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function CashEntryDetailSkeleton() {
  return (
    <div className="flex flex-col gap-y-6">
      {/* Header skeleton */}
      <div className="flex flex-row items-center gap-x-4">
        <div className="size-9 animate-pulse rounded-lg bg-neutral-100" />
        <div className="flex flex-col gap-y-1.5">
          <div className="h-5 w-32 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="ml-auto h-8 w-8 animate-pulse rounded-lg bg-neutral-100" />
      </div>

      {/* Info card skeleton */}
      <SectionCard title="Informasi Kas">
        <div className="flex flex-col gap-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-row items-center justify-between">
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
