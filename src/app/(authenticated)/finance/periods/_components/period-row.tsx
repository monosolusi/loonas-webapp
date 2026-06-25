"use client";

import { useMemo } from "react";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { ActionMenu, ActionMenuOption } from "@/core/presentations/components/action-menu";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";

type PeriodRowProps = {
  period: AccountingPeriodEntity;
};

export function PeriodRow({ period }: PeriodRowProps) {
  const { openCloseDialog, openReopenDialog } = usePeriods();

  const actionOptions = useMemo(() => {
    const opts: ActionMenuOption[] = [];
    if (period.canClose) opts.push({ label: "Tutup periode", onClick: () => openCloseDialog(period) });
    if (period.canReopen) opts.push({ label: "Buka kembali periode", onClick: () => openReopenDialog(period) });
    return opts;
  }, [period, openCloseDialog, openReopenDialog]);

  return (
    <div className="grid grid-cols-[2fr_1fr_64px] items-center border-b border-neutral-100 px-6 py-4 last:border-b-0">
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
  );
}
