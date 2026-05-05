export function ReceiptDetailLoading() {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="h-9 w-64 animate-pulse rounded-lg bg-neutral-100" />
      <div className="flex flex-col items-center">
        <div className="h-72 w-full max-w-md animate-pulse rounded-lg bg-neutral-100" />
      </div>
    </div>
  );
}
