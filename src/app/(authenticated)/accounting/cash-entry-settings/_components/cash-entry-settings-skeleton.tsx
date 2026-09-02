"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { CASH_ENTRY_SETTINGS_COPY } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/cash-entry-settings-copy";

export function CashEntrySettingsSkeleton() {
  return (
    <div className="flex flex-col gap-y-6">
      {/* Header skeleton */}
      <div className="flex flex-row items-center gap-x-4">
        <div className="size-9 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-5 w-40 animate-pulse rounded bg-neutral-100" />
      </div>

      {/* Settings card skeleton */}
      <SectionCard title={CASH_ENTRY_SETTINGS_COPY.defaultAccountCard.title}>
        <div className="flex flex-col gap-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
              <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-100" />
            </div>
          ))}

          <div className="h-4 w-full max-w-md animate-pulse rounded bg-neutral-100" />
          <div className="h-11 w-full max-w-40 animate-pulse rounded-lg bg-neutral-100" />
        </div>
      </SectionCard>
    </div>
  );
}
