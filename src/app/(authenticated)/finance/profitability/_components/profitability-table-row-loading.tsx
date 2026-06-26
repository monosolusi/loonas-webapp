"use client";

export function ProfitabilityTableRowLoading() {
  return (
    <>
      <div className="flex flex-col items-end gap-y-1">
        <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="flex justify-end">
        <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="flex flex-col items-end gap-y-1">
        <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-12 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="flex justify-center">
        <div className="h-5 w-20 animate-pulse rounded-sm bg-neutral-100" />
      </div>
    </>
  );
}
