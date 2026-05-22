"use client";

export function DashboardActiveMembersCardLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-y-3 rounded-xl border border-t border-r border-b-4 border-l border-neutral-100 bg-neutral-50 p-5">
      <div className="flex items-center gap-2">
        <div className="size-5 rounded bg-neutral-100" />
        <div className="h-4 w-24 rounded bg-neutral-100" />
      </div>
      <div className="h-8 w-16 rounded bg-neutral-100" />
    </div>
  );
}
