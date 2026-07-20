"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function ProfitabilityDetailSkeleton() {
  return (
    <div className="flex flex-col gap-y-6">
      {/* Header skeleton */}
      <div className="flex flex-row items-center gap-x-4">
        <div className="size-9 animate-pulse rounded-lg bg-neutral-100" />
        <div className="flex flex-col gap-y-1.5">
          <div className="h-5 w-32 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-48 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="HPP">
          <div className="flex flex-col gap-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
            <div className="mt-1 h-8 w-40 animate-pulse rounded bg-neutral-100" />
            <div className="my-4 border-t border-neutral-100" />
            <div className="h-3 w-32 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-48 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-48 animate-pulse rounded bg-neutral-100" />
          </div>
        </SectionCard>

        <SectionCard title="Laba Kotor">
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-row justify-between">
              <div className="h-4 w-36 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="flex flex-row justify-between">
              <div className="h-4 w-36 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="my-1 border-t border-neutral-100" />
            <div className="flex flex-row justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-32 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        <SectionCard title="Rekomendasi Harga Jual">
          <div className="flex flex-col gap-y-3">
            <div className="h-3 w-36 animate-pulse rounded bg-neutral-100" />
            <div className="h-10 w-48 animate-pulse rounded bg-neutral-100" />
            <div className="mt-2 h-11 w-full animate-pulse rounded-lg bg-neutral-100" />
            <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
