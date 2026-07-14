export function CheckoutStepMethodBodyLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 pt-6 pb-8 sm:grid-cols-2 sm:px-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="flex h-24 flex-row items-center gap-x-4 rounded-lg border border-neutral-200 p-4">
          <div className="size-12 shrink-0 animate-pulse rounded-lg bg-neutral-100" />
          <div className="flex flex-1 flex-col gap-y-2">
            <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-40 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
