"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useFixedCostEntries } from "@/app/(authenticated)/finance/fixed-costs/_providers/fixed-cost-entries-provider";
import { useListFixedCostEntriesByDate } from "@/features/fixed-cost/presentations/hooks/use-list-fixed-cost-entries-by-date";

export function CopyFromPrevMonthButton() {
  const { year, month, hasNoMaster, loading, saving, setAmount, isClosed } = useFixedCostEntries();

  const { startDate: prevStartDate, endDate: prevEndDate } = useMemo(() => {
    const prev = DateTime.local(year, month, 1).minus({ months: 1 });
    return {
      startDate: prev.toFormat("yyyy-MM-dd"),
      endDate: prev.endOf("month").toFormat("yyyy-MM-dd"),
    };
  }, [year, month]);

  const { entries: prevEntries, loading: loadingPrev } = useListFixedCostEntriesByDate({
    startDate: prevStartDate,
    endDate: prevEndDate,
  });

  const prevHasEntries = prevEntries.length > 0;
  const isDisabled = hasNoMaster || loading || saving || loadingPrev || !prevHasEntries || isClosed;

  const handleCopy = () => {
    for (const entry of prevEntries) {
      if (entry.fixedCost && entry.amount > 0) {
        setAmount(entry.fixedCost.id, entry.amount);
      }
    }
  };

  return (
    <SecondaryButton
      outlined
      label="Salin dari Bulan Lalu"
      onClick={handleCopy}
      disabled={isDisabled}
      loading={loadingPrev}
      className="w-auto whitespace-nowrap"
    />
  );
}
