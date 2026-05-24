"use client";

import clsx from "clsx";

export type ActivityTab = "all" | "pos" | "incoming" | "outgoing";

const tabs: { label: string; value: ActivityTab }[] = [
  { label: "Semua", value: "all" },
  { label: "POS", value: "pos" },
  { label: "Faktur Masuk", value: "incoming" },
  { label: "Faktur Keluar", value: "outgoing" },
];

interface DashboardRecentActivityTabsProps {
  active: ActivityTab;
  onChange: (t: ActivityTab) => void;
}

export function DashboardRecentActivityTabs({ active, onChange }: DashboardRecentActivityTabsProps) {
  return (
    <div role="tablist" className="flex items-center gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          id={`activity-tab-${tab.value}`}
          type="button"
          role="tab"
          aria-selected={active === tab.value}
          onClick={() => onChange(tab.value)}
          className={clsx(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            active === tab.value ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
