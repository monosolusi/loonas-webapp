"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { usePeriods, MANAGERIAL_COSTING_FEATURE } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

type PeriodRowProps = {
  period: AccountingPeriodEntity;
};

export function PeriodRow({ period }: PeriodRowProps) {
  const { openCloseDialog, openReopenDialog, openAllocateDialog, toggleAllocationPanel, isPanelOpen, isPeriodAllocated } = usePeriods();
  const { account } = useGetCurrentAccount();
  const hasManagerialCosting = account?.hasFeature(MANAGERIAL_COSTING_FEATURE) ?? false;
  const panelOpen = isPanelOpen(period.id);
  const periodAllocated = isPeriodAllocated(period.id);

  const actionOptions = useMemo(() => {
    const opts: ActionMenuOption[] = [];
    if (period.canClose) opts.push({ label: "Tutup periode", onClick: () => openCloseDialog(period) });
    if (period.canReopen) opts.push({ label: "Buka kembali periode", onClick: () => openReopenDialog(period) });
    if (hasManagerialCosting && period.isClosed) {
      // Dynamic verb: "Alokasi ulang" only when panel is open AND allocation state has been loaded
      // (written by PeriodAllocationPanel via setPeriodAllocated). Static default while closed.
      const allocationLabel = panelOpen && periodAllocated ? "Alokasi ulang biaya tetap" : "Alokasikan biaya tetap";
      opts.push({ label: allocationLabel, onClick: () => openAllocateDialog(period) });
    }
    return opts;
  }, [period, openCloseDialog, openReopenDialog, openAllocateDialog, hasManagerialCosting, panelOpen, periodAllocated]);

  return (
    <>
      {/* Desktop: grid row (lg and up) */}
      <div className="hidden grid-cols-[2fr_1fr_auto_64px] items-center gap-x-2 border-b border-neutral-100 px-6 py-4 last:border-b-0 lg:grid">
        <span className="text-sm font-medium text-neutral-500">{period.label}</span>
        <div>
          <StatusChip
            label={period.isClosed ? "Terkunci" : "Terbuka"}
            variant={period.isClosed ? "success" : "neutral"}
            compact
          />
        </div>
        <div>
          {hasManagerialCosting && period.isClosed ? (
            <button
              type="button"
              onClick={() => toggleAllocationPanel(period.id)}
              aria-label={panelOpen ? "Tutup panel alokasi" : "Buka panel alokasi"}
              aria-expanded={panelOpen}
              className="flex size-8 items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-neutral-50 hover:text-neutral-400"
            >
              <ChevronDownIcon
                className={clsx("size-4 transition-transform", panelOpen ? "rotate-180" : "rotate-0")}
                aria-hidden="true"
              />
            </button>
          ) : null}
        </div>
        <div className="flex justify-end">
          {actionOptions.length > 0 ? <ActionMenu options={actionOptions} /> : null}
        </div>
      </div>

      {/* Mobile: stacked block (below lg). No single navigation target here (unlike browse-list
          rows), so we don't use MobileListCard's tap-target model — instead mirror its visual
          chrome (padding, border, text sizing) while keeping the expand toggle and ActionMenu as
          independent, always-visible controls. */}
      <div className="flex flex-col gap-2 border-b border-neutral-100 px-4 py-3.5 last:border-b-0 lg:hidden">
        <span className="truncate text-sm font-semibold text-neutral-500">{period.label}</span>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <StatusChip
              label={period.isClosed ? "Terkunci" : "Terbuka"}
              variant={period.isClosed ? "success" : "neutral"}
              compact
            />
            {hasManagerialCosting && period.isClosed ? (
              <button
                type="button"
                onClick={() => toggleAllocationPanel(period.id)}
                aria-label={panelOpen ? "Tutup panel alokasi" : "Buka panel alokasi"}
                aria-expanded={panelOpen}
                className="flex size-8 items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-neutral-50 hover:text-neutral-400"
              >
                <ChevronDownIcon
                  className={clsx("size-4 transition-transform", panelOpen ? "rotate-180" : "rotate-0")}
                  aria-hidden="true"
                />
              </button>
            ) : null}
          </div>
          {actionOptions.length > 0 ? <ActionMenu options={actionOptions} /> : null}
        </div>
      </div>
    </>
  );
}
