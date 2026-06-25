"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function HppBlockLoading() {
  return (
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
  );
}
