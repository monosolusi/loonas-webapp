"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function TaxPostureLoading() {
  return (
    <div className="flex flex-col gap-y-6">
      {/* Form card skeleton */}
      <SectionCard title="Informasi Pajak">
        <div className="flex flex-col gap-y-5">
          <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-x-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="animate-pulse h-4 w-24 rounded bg-neutral-100" />
                <div className="animate-pulse h-11 rounded-lg bg-neutral-100" />
              </div>
            ))}
          </div>
          <div className="my-5 border-t border-neutral-100" />
          <div className="flex items-center justify-between gap-x-4">
            <div className="flex flex-col gap-y-1">
              <div className="animate-pulse h-4 w-32 rounded bg-neutral-100" />
              <div className="animate-pulse h-3 w-64 rounded bg-neutral-100" />
            </div>
            <div className="animate-pulse h-6 w-10 rounded-full bg-neutral-100" />
          </div>
          <div className="flex items-center justify-between gap-x-4">
            <div className="flex flex-col gap-y-1">
              <div className="animate-pulse h-4 w-28 rounded bg-neutral-100" />
              <div className="animate-pulse h-3 w-72 rounded bg-neutral-100" />
            </div>
            <div className="animate-pulse h-5 w-16 rounded-sm bg-neutral-100" />
          </div>
          <div className="mt-6 flex justify-end gap-x-3">
            <div className="animate-pulse h-11 w-28 rounded-lg bg-neutral-100" />
            <div className="animate-pulse h-11 w-36 rounded-lg bg-neutral-100" />
          </div>
        </div>
      </SectionCard>

      {/* History card skeleton */}
      <SectionCard title="Riwayat Perubahan">
        <div className="flex flex-col gap-y-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-y-3 border-b border-neutral-100 px-0 py-4 last:border-b-0">
              <div className="flex items-center justify-between">
                <div className="animate-pulse h-4 w-36 rounded bg-neutral-100" />
                <div className="animate-pulse h-5 w-16 rounded-sm bg-neutral-100" />
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="animate-pulse h-4 w-full max-w-xs rounded bg-neutral-100" />
                <div className="animate-pulse h-4 w-full max-w-sm rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
