"use client";

import { TabFilter } from "@/core/presentations/components/tab-filter";

export type ActivityTab = "all" | "pos" | "incoming" | "outgoing";

const tabs: { label: string; value: ActivityTab }[] = [
  { label: "Semua", value: "all" },
  { label: "POS", value: "pos" },
  { label: "Faktur Masuk", value: "incoming" },
  { label: "Faktur Keluar", value: "outgoing" },
];

const TAB_LABELS = tabs.map((t) => t.label);

interface DashboardRecentActivityTabsProps {
  active: ActivityTab;
  onChange: (t: ActivityTab) => void;
}

export function DashboardRecentActivityTabs({ active, onChange }: DashboardRecentActivityTabsProps) {
  const selectedIndex = Math.max(
    tabs.findIndex((t) => t.value === active),
    0,
  );

  return (
    <div className="max-w-[150px] overflow-x-auto sm:max-w-none">
      <TabFilter tabs={TAB_LABELS} selectedIndex={selectedIndex} onChange={(index) => onChange(tabs[index].value)} />
    </div>
  );
}
