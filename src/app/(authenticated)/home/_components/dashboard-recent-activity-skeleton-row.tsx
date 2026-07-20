"use client";

export function DashboardRecentActivitySkeletonRow() {
  return (
    <>
      {/* Desktop: grid skeleton (lg and up) */}
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0 lg:grid">
        <div className="flex items-center gap-2">
          <div className="size-7 shrink-0 animate-pulse rounded-lg bg-neutral-100" />
          <div className="flex flex-col gap-1">
            <div className="h-5 w-32 animate-pulse rounded bg-neutral-100" />
            <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
        <div className="h-5 w-20 animate-pulse rounded bg-neutral-100" />
        <div className="h-5 w-24 animate-pulse rounded bg-neutral-100" />
        <div className="h-5 w-28 animate-pulse rounded bg-neutral-100" />
      </div>

      {/* Mobile: card skeleton (below lg) */}
      <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3.5 last:border-b-0 lg:hidden">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="h-4 w-32 animate-pulse rounded bg-neutral-100" />
          <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
          <div className="h-3 w-12 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    </>
  );
}
