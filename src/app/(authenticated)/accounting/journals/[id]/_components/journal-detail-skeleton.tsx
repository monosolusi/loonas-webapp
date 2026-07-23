"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function JournalDetailSkeleton() {
  return (
    <div className="flex flex-col gap-y-6">
      {/* Header skeleton */}
      <div className="flex flex-row items-center gap-x-4">
        <div className="size-9 animate-pulse rounded-lg bg-neutral-100" />
        <div className="flex flex-col gap-y-1.5">
          <div className="h-5 w-32 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="ml-auto h-11 w-28 animate-pulse rounded-lg bg-neutral-100" />
      </div>

      {/* Info card skeleton */}
      <SectionCard title="Informasi Jurnal">
        <div className="flex flex-col gap-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-row items-center justify-between">
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Lines card skeleton */}
      <SectionCard title="Baris Jurnal">
        <div className="flex flex-col gap-y-3">
          <div className="grid grid-cols-[1.5fr_3fr_1fr_1fr] gap-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-3 animate-pulse rounded bg-neutral-100" />
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[1.5fr_3fr_1fr_1fr] gap-x-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 animate-pulse rounded bg-neutral-100" />
              ))}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
