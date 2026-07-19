"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function PphFinalSkeleton() {
  return (
    <div className="flex flex-col gap-y-6">
      {/* Header placeholder */}
      <div className="flex flex-row items-center gap-x-4">
        <div className="size-9 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-5 w-48 animate-pulse rounded bg-neutral-100" />
        <div className="ml-auto h-11 w-36 animate-pulse rounded-lg bg-neutral-100" />
      </div>

      {/* Form card placeholder */}
      <SectionCard title="">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-32 rounded bg-neutral-100" />
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="h-11 rounded-lg bg-neutral-100" />
            <div className="h-11 rounded-lg bg-neutral-100" />
            <div className="h-11 rounded-lg bg-neutral-100" />
            <div className="h-11 rounded-lg bg-neutral-100" />
          </div>
        </div>
      </SectionCard>

      {/* Preview card placeholder */}
      <SectionCard title="">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-neutral-100" />
          <div className="h-4 w-full rounded bg-neutral-100" />
          <div className="h-4 w-full rounded bg-neutral-100" />
        </div>
      </SectionCard>
    </div>
  );
}
