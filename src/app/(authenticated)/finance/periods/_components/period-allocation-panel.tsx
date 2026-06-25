"use client";

import { useEffect } from "react";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { useGetManagerialCost } from "@/features/accounting/presentations/hooks/use-get-managerial-cost";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";
import { PeriodAllocationPanelLoading } from "@/app/(authenticated)/finance/periods/_components/period-allocation-panel-loading";
import { PeriodAllocationPanelEmpty } from "@/app/(authenticated)/finance/periods/_components/period-allocation-panel-empty";
import { PeriodAllocationPanelError } from "@/app/(authenticated)/finance/periods/_components/period-allocation-panel-error";
import { PeriodAllocationPanelData } from "@/app/(authenticated)/finance/periods/_components/period-allocation-panel-data";

type PeriodAllocationPanelProps = {
  period: AccountingPeriodEntity;
};

export function PeriodAllocationPanel({ period }: PeriodAllocationPanelProps) {
  const { isPanelOpen, setPeriodAllocated } = usePeriods();
  const panelOpen = isPanelOpen(period.id);
  const state = useGetManagerialCost({ periodId: period.id, enabled: panelOpen });

  // Write allocation state back to the provider when data loads so PeriodRow can
  // pick the correct ActionMenu verb without firing a new GET.
  // Only runs when panel is open and data has arrived — no eager fetch on close.
  useEffect(() => {
    if (state.status === "loaded") {
      setPeriodAllocated(period.id, state.isAllocated);
    }
  }, [state.status, state.isAllocated, period.id, setPeriodAllocated]);

  if (!panelOpen) return null;

  if (state.status === "loading") return <PeriodAllocationPanelLoading />;

  if (state.status === "error") return <PeriodAllocationPanelError error={state.error} />;

  if (state.status === "loaded" && !state.isAllocated) {
    return <PeriodAllocationPanelEmpty period={period} />;
  }

  if (state.status === "loaded" && state.isAllocated) {
    return <PeriodAllocationPanelData projections={state.projections} />;
  }

  // initial/loading state with panel open — render loading as fallback
  return <PeriodAllocationPanelLoading />;
}
