export function OverheadAccountsLoading() {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-32 animate-pulse rounded bg-neutral-100" />
        </div>
        <div className="h-11 w-32 animate-pulse rounded-lg bg-neutral-100" />
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <div className="flex flex-col gap-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-5 w-full animate-pulse rounded bg-neutral-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
