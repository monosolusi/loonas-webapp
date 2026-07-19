"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import {
  AllocationPeriod,
  OverheadAllocationEntity,
} from "@/features/profitability/domain/entities/overhead-allocation";

type OverheadAllocationCaptionProps = {
  allocation: OverheadAllocationEntity;
};

/** Formats an allocation period as a compact Indonesian range, collapsing shared month/year. */
function formatPeriod(period: AllocationPeriod): string {
  const start = DateTime.fromISO(period.startAt).setLocale("id");
  const end = DateTime.fromISO(period.endAt).setLocale("id");
  if (!start.isValid || !end.isValid) return "";

  const sameYear = start.year === end.year;
  const sameMonth = sameYear && start.month === end.month;

  if (sameMonth) return `${start.toFormat("d")}–${end.toFormat("d MMM yyyy")}`;
  if (sameYear) return `${start.toFormat("d MMM")} – ${end.toFormat("d MMM yyyy")}`;
  return `${start.toFormat("d MMM yyyy")} – ${end.toFormat("d MMM yyyy")}`;
}

export function OverheadAllocationCaption({ allocation }: OverheadAllocationCaptionProps) {
  const caption = useMemo(() => {
    switch (allocation.source) {
      case "allocated":
        return allocation.allocationPeriod
          ? `Teralokasi · periode ${formatPeriod(allocation.allocationPeriod)}`
          : "Teralokasi otomatis dari biaya tetap produksi";
      case "none":
      default:
        return "Belum ada alokasi biaya tetap produksi.";
    }
  }, [allocation]);

  return <span className="text-xs text-neutral-300">{caption}</span>;
}
