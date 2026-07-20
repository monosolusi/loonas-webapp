export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-row items-center gap-x-4">
        <div className="size-9 animate-pulse rounded-lg bg-neutral-100" />
        <div className="flex flex-col gap-y-1">
          <div className="h-5 w-40 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-x-6">
        <div className="lg:flex-1">
          <div className="h-64 animate-pulse rounded-lg bg-neutral-100" />
        </div>
        <div className="lg:w-[280px]">
          <div className="h-40 animate-pulse rounded-lg bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
