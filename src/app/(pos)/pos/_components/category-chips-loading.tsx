export function CategoryChipsLoading() {
  return (
    <div className="flex flex-row gap-x-2 overflow-x-auto py-1">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="h-11 w-20 shrink-0 animate-pulse rounded-full bg-neutral-100" />
      ))}
    </div>
  );
}
