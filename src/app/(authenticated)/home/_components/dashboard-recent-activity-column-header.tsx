"use client";

export function DashboardRecentActivityColumnHeader() {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3 text-xs tracking-wide text-neutral-300">
      <span className="font-medium">PIHAK</span>
      <span className="font-medium">NOMINAL</span>
      <span className="font-medium">STATUS</span>
    </div>
  );
}
