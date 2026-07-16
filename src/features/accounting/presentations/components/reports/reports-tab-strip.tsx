"use client";

import { TabFilter } from "@/core/presentations/components/tab-filter";

type TabId = "balance-sheet" | "income-statement" | "cash-flow" | "trial-balance" | "buku-besar" | "notes";

type TabDefinition = {
  id: TabId;
  label: string;
};

const TABS: TabDefinition[] = [
  { id: "balance-sheet", label: "Neraca" },
  { id: "income-statement", label: "Laba Rugi" },
  { id: "cash-flow", label: "Arus Kas" },
  { id: "trial-balance", label: "Neraca Saldo" },
  { id: "buku-besar", label: "Buku Besar" },
  { id: "notes", label: "CALK" },
];

const TAB_LABELS = TABS.map((tab) => tab.label);

type ReportsTabStripProps = {
  activeTab: TabId;
  onTabChange?: (id: string) => void;
};

export function ReportsTabStrip({ activeTab, onTabChange }: ReportsTabStripProps) {
  const selectedIndex = TABS.findIndex((tab) => tab.id === activeTab);

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
      <TabFilter
        tabs={TAB_LABELS}
        selectedIndex={selectedIndex}
        onChange={(index) => onTabChange?.(TABS[index].id)}
      />
    </div>
  );
}
