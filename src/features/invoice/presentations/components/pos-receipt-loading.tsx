export function PosReceiptLoading() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-1 flex-col items-center gap-y-6 overflow-y-auto p-6">
        {/* Status banner */}
        <div className="h-14 w-full animate-pulse rounded-lg border border-neutral-200 bg-white" />

        {/* Receipt card + timeline */}
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-y-4 rounded-lg border border-neutral-200 bg-white p-6">
            <div className="flex flex-col items-center gap-y-1">
              <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-32 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="border-t border-t-neutral-100" />
            <div className="flex flex-col gap-y-3">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex flex-row items-center gap-x-3">
                  <div className="size-6 shrink-0 animate-pulse rounded-md bg-neutral-100" />
                  <div className="h-3 flex-1 animate-pulse rounded bg-neutral-100" />
                  <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
                </div>
              ))}
            </div>
            <div className="border-t border-t-neutral-100" />
            <div className="flex flex-row items-baseline justify-between">
              <div className="h-3 w-12 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>

          <div className="flex flex-col gap-y-4 rounded-lg border border-neutral-200 bg-white p-6">
            <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex flex-row gap-x-3">
                <div className="size-2.5 shrink-0 animate-pulse rounded-full bg-neutral-100" />
                <div className="flex flex-1 flex-col gap-y-1">
                  <div className="h-3 w-28 animate-pulse rounded bg-neutral-100" />
                  <div className="h-2.5 w-36 animate-pulse rounded bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="shrink-0 border-t border-neutral-100 bg-white p-4">
        <div className="mx-auto flex w-full max-w-md flex-col gap-y-3">
          <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-100" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
