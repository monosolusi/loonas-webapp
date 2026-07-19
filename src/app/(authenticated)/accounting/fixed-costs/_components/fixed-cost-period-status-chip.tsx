"use client";

import { StatusChip } from "@/core/presentations/components/status-chip";
import { useFixedCostEntries } from "@/app/(authenticated)/accounting/fixed-costs/_providers/fixed-cost-entries-provider";

export function FixedCostPeriodStatusChip() {
  const { matchedPeriod, isClosed, periodLoading } = useFixedCostEntries();

  if (periodLoading) return null;
  if (!matchedPeriod) return null;

  return (
    <span role="status">
      {isClosed ? (
        <StatusChip variant="warning" label="Ditutup" />
      ) : (
        <StatusChip variant="neutral" label="Terbuka" />
      )}
    </span>
  );
}
