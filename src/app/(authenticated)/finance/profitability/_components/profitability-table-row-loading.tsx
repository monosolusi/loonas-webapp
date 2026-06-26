"use client";

export function ProfitabilityTableRowLoading() {
  return (
    <>
      <div className="col-span-1 flex justify-end">
        <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="col-span-1 flex justify-end">
        <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="col-span-1 flex justify-end">
        <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="col-span-1 flex justify-end">
        <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="col-span-1 flex justify-end">
        <div className="h-3 w-12 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="col-span-1 flex justify-center">
        <div className="h-5 w-20 animate-pulse rounded-sm bg-neutral-100" />
      </div>
    </>
  );
}
