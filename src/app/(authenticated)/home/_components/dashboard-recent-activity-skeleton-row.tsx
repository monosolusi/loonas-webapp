"use client";

export function DashboardRecentActivitySkeletonRow() {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0">
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
  );
}
