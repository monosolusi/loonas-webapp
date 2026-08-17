export function KycSummarySkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-64 animate-pulse rounded bg-neutral-100" />
        <div className="h-5 w-80 animate-pulse rounded bg-neutral-100" />
      </div>
      <div className="flex w-full flex-col gap-8">
        <div className="h-24 w-full animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-20 w-full animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-20 w-full animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-40 w-full animate-pulse rounded-xl bg-neutral-100" />
      </div>
    </div>
  );
}
