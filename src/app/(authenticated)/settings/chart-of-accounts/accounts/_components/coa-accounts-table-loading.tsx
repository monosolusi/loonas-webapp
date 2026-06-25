"use client";

export function CoaAccountsTableLoading() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-x-4 border-b border-neutral-100 px-6 py-4 last:border-b-0">
          <div className="h-4 w-16 rounded bg-neutral-100" />
          <div className="h-4 flex-1 rounded bg-neutral-100" />
          <div className="h-4 w-32 rounded bg-neutral-100" />
          <div className="h-4 w-32 rounded bg-neutral-100" />
          <div className="h-4 w-16 rounded bg-neutral-100" />
          <div className="h-4 w-8 rounded bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}
