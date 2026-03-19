"use client";

import { useFixedCostEntries } from "@/app/(authenticated)/finance/fixed-costs/_providers/fixed-cost-entries-provider";

export function FixedCostSubtitle() {
  const { masterCount } = useFixedCostEntries();

  return <p className="leading-6 text-neutral-300">{masterCount} jenis biaya</p>;
}
