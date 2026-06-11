export function ProductPickerBodyLoading() {
  return (
    <div className="flex flex-col gap-y-1 p-2">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="h-11 w-full animate-pulse rounded-md bg-neutral-50" />
      ))}
    </div>
  );
}
