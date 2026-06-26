"use client";

export function ProfitabilityTableRowLoading() {
  return (
    <>
      <div className="flex justify-center">
        <div className="h-3 w-28 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="flex justify-end">
        <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="flex justify-center">
        <div className="h-3 w-28 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="flex justify-start">
        <div className="h-5 w-20 animate-pulse rounded-sm bg-neutral-100" />
      </div>
    </>
  );
}
