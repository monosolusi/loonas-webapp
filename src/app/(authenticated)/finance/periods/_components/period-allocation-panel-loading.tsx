"use client";

export function PeriodAllocationPanelLoading() {
  return (
    <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-4" aria-busy="true" aria-label="Memuat data alokasi">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-2/3 rounded bg-neutral-100" />
        <div className="h-4 w-full rounded bg-neutral-100" />
        <div className="h-4 w-5/6 rounded bg-neutral-100" />
      </div>
    </div>
  );
}
