"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function WizardLoadingSkeleton() {
  return (
    <SectionCard title="">
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-6 w-48 rounded bg-neutral-100" />
        <div className="h-4 w-full max-w-prose rounded bg-neutral-100" />
        <div className="h-4 w-3/4 rounded bg-neutral-100" />
        <div className="mt-4 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-5 rounded-full bg-neutral-100 shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="h-3 w-32 rounded bg-neutral-100" />
                <div className="h-2 w-64 rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <div className="h-11 w-24 rounded-lg bg-neutral-100" />
        </div>
      </div>
    </SectionCard>
  );
}
