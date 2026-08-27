export function CashEntriesLoading() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      <div className="flex flex-col gap-y-4 p-6 motion-safe:animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-row items-center gap-x-4">
            <div className="h-4 w-24 rounded bg-neutral-100" />
            <div className="h-4 w-20 rounded bg-neutral-100" />
            <div className="h-4 flex-1 rounded bg-neutral-100" />
            <div className="h-4 w-20 rounded bg-neutral-100" />
            <div className="h-4 w-16 rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
