"use client";

import { useMemo } from "react";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { usePeriods, MANAGERIAL_COSTING_FEATURE } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

type PeriodRowProps = {
  period: AccountingPeriodEntity;
};

export function PeriodRow({ period }: PeriodRowProps) {
  const { openCloseDialog, openReopenDialog, openAllocateDialog } = usePeriods();
  const { account } = useGetCurrentAccount();
  const hasManagerialCosting = account?.hasFeature(MANAGERIAL_COSTING_FEATURE) ?? false;

  const actionOptions = useMemo(() => {
    const opts: ActionMenuOption[] = [];
    if (period.canClose) opts.push({ label: "Tutup periode", onClick: () => openCloseDialog(period) });
    if (period.canReopen) opts.push({ label: "Buka kembali periode", onClick: () => openReopenDialog(period) });
    if (hasManagerialCosting && period.isClosed) {
      opts.push({ label: "Alokasikan biaya tetap", onClick: () => openAllocateDialog(period) });
    }
    return opts;
  }, [period, openCloseDialog, openReopenDialog, openAllocateDialog, hasManagerialCosting]);

  return (
    <>
      {/* Desktop: grid row (lg and up) */}
      <div className="hidden grid-cols-[2fr_1fr_64px] items-center gap-x-2 border-b border-neutral-100 px-6 py-4 last:border-b-0 lg:grid">
        <span className="text-sm font-medium text-neutral-500">{period.label}</span>
        <div>
          <StatusChip
            label={period.isClosed ? "Terkunci" : "Terbuka"}
            variant={period.isClosed ? "success" : "neutral"}
            compact
          />
        </div>
        <div className="flex justify-end">
          {actionOptions.length > 0 ? <ActionMenu options={actionOptions} /> : null}
        </div>
      </div>

      {/* Mobile: stacked block (below lg). No single navigation target here (unlike browse-list
          rows), so we don't use MobileListCard's tap-target model — instead mirror its visual
          chrome (padding, border, text sizing) while keeping the ActionMenu as an independent,
          always-visible control. */}
      <div className="flex flex-col gap-2 border-b border-neutral-100 px-4 py-3.5 last:border-b-0 lg:hidden">
        <span className="truncate text-sm font-semibold text-neutral-500">{period.label}</span>
        <div className="flex items-center justify-between gap-2">
          <StatusChip
            label={period.isClosed ? "Terkunci" : "Terbuka"}
            variant={period.isClosed ? "success" : "neutral"}
            compact
          />
          {actionOptions.length > 0 ? <ActionMenu options={actionOptions} /> : null}
        </div>
      </div>
    </>
  );
}
