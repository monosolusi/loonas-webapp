export function CheckoutStepMethodBodyLoading() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="flex h-11 flex-row items-center justify-between border-b border-b-neutral-100 px-3"
        >
          <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
          <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}
