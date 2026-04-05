export function PurchaseDetailLoading() {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-neutral-100" />
      <div className="grid grid-cols-2 gap-x-6">
        <div className="h-40 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-40 animate-pulse rounded-lg bg-neutral-100" />
      </div>
      <div className="h-48 animate-pulse rounded-lg bg-neutral-100" />
    </div>
  );
}
