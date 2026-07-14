"use client";

export function DashboardRecentActivityColumnHeader() {
  return (
    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3 text-xs tracking-wide text-neutral-300 lg:grid">
      <span className="font-medium">PIHAK</span>
      <span className="font-medium">METODE</span>
      <span className="font-medium">NOMINAL</span>
      <span className="font-medium">STATUS</span>
    </div>
  );
}
