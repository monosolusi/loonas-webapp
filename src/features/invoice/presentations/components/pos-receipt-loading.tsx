export function PosReceiptLoading() {
  return (
    <div className="flex w-full max-w-md flex-col gap-y-4 rounded-lg border border-neutral-200 bg-white p-6">
      <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
      <div className="h-3 w-32 animate-pulse rounded bg-neutral-100" />
      <div className="border-t border-t-neutral-100" />
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row gap-x-2">
          <div className="h-3 flex-1 animate-pulse rounded bg-neutral-100" />
          <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="flex flex-row gap-x-2">
          <div className="h-3 flex-1 animate-pulse rounded bg-neutral-100" />
          <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
      <div className="border-t border-t-neutral-100" />
      <div className="flex flex-row justify-between">
        <div className="h-3 w-12 animate-pulse rounded bg-neutral-100" />
        <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
      </div>
    </div>
  );
}
