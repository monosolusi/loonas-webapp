"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

export function WizardBalancesLoading() {
  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-right text-xs text-neutral-300">Langkah 2 dari 3</p>
      <SectionCard title="">
        <div className="flex flex-col gap-4 px-0 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-neutral-100">
              <div className="flex h-11 items-center gap-3 px-4">
                <div className="size-4 rounded bg-neutral-100" />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="h-3 w-32 rounded bg-neutral-100" />
                  <div className="h-2 w-48 rounded bg-neutral-100" />
                </div>
                <div className="h-3 w-20 rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
