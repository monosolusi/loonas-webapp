"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { StatusChip } from "@/core/presentations/components/status-chip";

type TabId = "neraca" | "laba-rugi" | "arus-kas" | "trial-balance" | "buku-besar" | "calk";

type TabDefinition = {
  id: TabId;
  label: string;
  disabled: boolean;
  panelId: string;
};

const TABS: TabDefinition[] = [
  { id: "neraca", label: "Neraca", disabled: false, panelId: "panel-neraca" },
  { id: "laba-rugi", label: "Laba Rugi", disabled: false, panelId: "panel-laba-rugi" },
  { id: "arus-kas", label: "Arus Kas", disabled: false, panelId: "panel-arus-kas" },
  { id: "trial-balance", label: "Neraca Saldo", disabled: false, panelId: "panel-trial-balance" },
  { id: "buku-besar", label: "Buku Besar", disabled: false, panelId: "panel-buku-besar" },
  { id: "calk", label: "CALK", disabled: false, panelId: "panel-calk" },
];

type ReportsTabStripProps = {
  activeTab: "neraca" | "trial-balance" | "buku-besar" | "laba-rugi" | "arus-kas" | "calk";
  onTabChange?: (id: string) => void;
};

export function ReportsTabStrip({ activeTab, onTabChange }: ReportsTabStripProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeIndex = TABS.findIndex((t) => t.id === activeTab);
    const activeEl = tabRefs.current[activeIndex];
    if (activeEl) setIndicator({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
  }, [activeTab]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % TABS.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = TABS.length - 1;
    } else if (event.key === "Enter" || event.key === " ") {
      const currentTab = TABS[currentIndex];
      if (currentTab && !currentTab.disabled) {
        onTabChange?.(currentTab.id);
      }
      event.preventDefault();
      return;
    } else {
      return;
    }

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div
        role="tablist"
        aria-label="Jenis laporan"
        className="relative flex overflow-x-auto"
        onKeyDown={handleKeyDown}
      >
        {TABS.map((tab, index) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={!tab.disabled ? tab.panelId : undefined}
              aria-disabled={tab.disabled ? "true" : undefined}
              tabIndex={isActive ? 0 : -1}
              title={tab.disabled ? "Segera hadir" : undefined}
              className={clsx(
                "relative flex h-11 items-center gap-x-2 whitespace-nowrap px-4 text-sm",
                isActive
                  ? "font-semibold text-primary-300"
                  : tab.disabled
                    ? "cursor-not-allowed font-medium text-neutral-200"
                    : "font-medium text-neutral-300 hover:bg-neutral-50 hover:text-neutral-500",
                "focus-visible:outline-2 focus-visible:outline-offset-2",
                tab.disabled ? "focus-visible:outline-neutral-300" : "focus-visible:outline-primary-300",
              )}
              onClick={() => {
                if (!tab.disabled) {
                  onTabChange?.(tab.id);
                }
              }}
            >
              {tab.label}
              {tab.disabled && <StatusChip label="Segera hadir" variant="neutral" compact />}
            </button>
          );
        })}

        {/* Dynamic measured offset — CSS var carve-out per Rule 13 (mirrors dashboard-range-payment-breakdown). */}
        <span
          aria-hidden
          className="absolute bottom-0 left-[var(--indicator-left)] h-0.5 w-[var(--indicator-width)] bg-primary-300 motion-safe:transition-all motion-safe:duration-150 motion-safe:ease-out"
          style={
            {
              "--indicator-left": `${indicator.left}px`,
              "--indicator-width": `${indicator.width}px`,
            } as React.CSSProperties
          }
        />
      </div>
      <div className="h-px bg-neutral-100" />
    </div>
  );
}
